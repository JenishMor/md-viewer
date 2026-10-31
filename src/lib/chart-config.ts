// Validates the JSON inside ```chartjs fenced blocks and rebuilds a Chart.js
// configuration from an allow-list. Nothing from the source is passed through
// unchecked, so callbacks, plugins and external resources can never be injected.

export const CHART_TYPES = [
  "bar",
  "line",
  "pie",
  "doughnut",
  "radar",
  "polarArea",
  "scatter",
  "bubble",
] as const;

export type ChartType = (typeof CHART_TYPES)[number];

const MAX_DATASETS = 20;
const MAX_POINTS = 2000;
const MAX_LABEL_LENGTH = 200;

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type JsonObject = { [key: string]: Json };

export type ChartPoint = number | null | { x: number | string; y: number; r?: number };

export interface SafeDataset {
  label?: string;
  data: ChartPoint[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  hidden?: boolean;
  stack?: string;
  type?: ChartType;
}

export interface SafeChartConfig {
  type: ChartType;
  data: { labels?: string[]; datasets: SafeDataset[] };
  options: {
    indexAxis?: "x" | "y";
    title?: string;
    legend?: { display: boolean; position: "top" | "bottom" | "left" | "right" };
    scales?: Record<
      "x" | "y",
      {
        beginAtZero?: boolean;
        stacked?: boolean;
        min?: number;
        max?: number;
        title?: string;
      }
    >;
  };
}

export type ChartParseResult =
  | { ok: true; config: SafeChartConfig }
  | { ok: false; error: string };

class ChartConfigError extends Error {}

function fail(message: string): never {
  throw new ChartConfigError(message);
}

function isObject(v: unknown): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Hex, rgb(a), hsl(a) and CSS named colors only - no url(), var() or expressions.
const COLOR_RE =
  /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\(\s*[\d.%\s,/+-]+\)|[a-z]{3,20})$/i;

function color(v: Json | undefined, path: string): string | string[] | undefined {
  if (v === undefined) return undefined;
  if (typeof v === "string") {
    if (!COLOR_RE.test(v.trim())) fail(`${path}: "${v}" is not a supported color`);
    return v.trim();
  }
  if (Array.isArray(v)) {
    return v.map((c, i) => {
      if (typeof c !== "string" || !COLOR_RE.test(c.trim())) {
        fail(`${path}[${i}] is not a supported color`);
      }
      return c.trim();
    });
  }
  fail(`${path} must be a color string or a list of colors`);
}

function num(v: Json | undefined, path: string, min = -Infinity, max = Infinity) {
  if (v === undefined) return undefined;
  if (typeof v !== "number" || !Number.isFinite(v)) fail(`${path} must be a number`);
  if (v < min || v > max) fail(`${path} must be between ${min} and ${max}`);
  return v;
}

function bool(v: Json | undefined, path: string) {
  if (v === undefined) return undefined;
  if (typeof v !== "boolean") fail(`${path} must be true or false`);
  return v;
}

function str(v: Json | undefined, path: string) {
  if (v === undefined) return undefined;
  if (typeof v !== "string" && typeof v !== "number") fail(`${path} must be text`);
  return String(v).slice(0, MAX_LABEL_LENGTH);
}

function chartType(v: Json | undefined, path: string): ChartType {
  if (typeof v !== "string" || !CHART_TYPES.includes(v as ChartType)) {
    fail(`${path} must be one of: ${CHART_TYPES.join(", ")}`);
  }
  return v as ChartType;
}

function point(v: Json, path: string, type: ChartType): ChartPoint {
  if (v === null) return null;
  if (typeof v === "number") {
    if (!Number.isFinite(v)) fail(`${path} must be a finite number`);
    return v;
  }
  if (isObject(v) && (type === "scatter" || type === "bubble" || type === "line")) {
    const x = v.x;
    if (typeof x !== "number" && typeof x !== "string") fail(`${path}.x must be a number or text`);
    const y = num(v.y, `${path}.y`);
    if (y === undefined) fail(`${path}.y is required`);
    const r = num(v.r, `${path}.r`, 0, 1000);
    return r === undefined ? { x, y } : { x, y, r };
  }
  fail(
    type === "scatter" || type === "bubble"
      ? `${path} must be a {"x": .., "y": ..} point`
      : `${path} must be a number`,
  );
}

function dataset(v: Json, index: number, type: ChartType): SafeDataset {
  const path = `data.datasets[${index}]`;
  if (!isObject(v)) fail(`${path} must be an object`);
  if (!Array.isArray(v.data)) fail(`${path}.data must be a list`);
  const dsType = v.type === undefined ? undefined : chartType(v.type, `${path}.type`);
  const ds: SafeDataset = {
    label: str(v.label, `${path}.label`),
    data: v.data.map((p, i) => point(p, `${path}.data[${i}]`, dsType ?? type)),
    backgroundColor: color(v.backgroundColor, `${path}.backgroundColor`),
    borderColor: color(v.borderColor, `${path}.borderColor`),
    borderWidth: num(v.borderWidth, `${path}.borderWidth`, 0, 20),
    fill: bool(v.fill, `${path}.fill`),
    tension: num(v.tension, `${path}.tension`, 0, 1),
    pointRadius: num(v.pointRadius, `${path}.pointRadius`, 0, 50),
    hidden: bool(v.hidden, `${path}.hidden`),
    stack: str(v.stack, `${path}.stack`),
    type: dsType,
  };
  for (const key of Object.keys(ds) as (keyof SafeDataset)[]) {
    if (ds[key] === undefined) delete ds[key];
  }
  return ds;
}

function axis(v: Json | undefined, path: string) {
  if (v === undefined) return undefined;
  if (!isObject(v)) fail(`${path} must be an object`);
  const title = isObject(v.title) ? str(v.title.text, `${path}.title.text`) : str(v.title, `${path}.title`);
  return {
    beginAtZero: bool(v.beginAtZero, `${path}.beginAtZero`),
    stacked: bool(v.stacked, `${path}.stacked`),
    min: num(v.min, `${path}.min`),
    max: num(v.max, `${path}.max`),
    title,
  };
}

export function parseChartConfig(source: string): ChartParseResult {
  let raw: Json;
  try {
    raw = JSON.parse(source);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Invalid JSON: ${message}` };
  }

  try {
    if (!isObject(raw)) fail("The chart configuration must be a JSON object");
    const type = chartType(raw.type, "type");
    if (!isObject(raw.data)) fail('"data" must be an object');
    const { labels, datasets } = raw.data;
    if (labels !== undefined && !Array.isArray(labels)) fail("data.labels must be a list");
    if (!Array.isArray(datasets) || datasets.length === 0) {
      fail("data.datasets must be a non-empty list");
    }
    if (datasets.length > MAX_DATASETS) fail(`At most ${MAX_DATASETS} datasets are supported`);

    const safeDatasets = datasets.map((d, i) => dataset(d, i, type));
    const points = safeDatasets.reduce((n, d) => n + d.data.length, 0);
    if (points > MAX_POINTS) fail(`At most ${MAX_POINTS} data points are supported`);

    const options = isObject(raw.options) ? raw.options : {};
    const plugins = isObject(options.plugins) ? options.plugins : {};
    const titleSrc = plugins.title ?? options.title;
    const title = isObject(titleSrc) ? str(titleSrc.text, "options.plugins.title.text") : str(titleSrc, "options.title");
    const legendSrc = isObject(plugins.legend) ? plugins.legend : undefined;
    const position = legendSrc?.position;
    if (position !== undefined && !["top", "bottom", "left", "right"].includes(String(position))) {
      fail("options.plugins.legend.position must be top, bottom, left or right");
    }
    const scales = isObject(options.scales) ? options.scales : undefined;
    const indexAxis = options.indexAxis;
    if (indexAxis !== undefined && indexAxis !== "x" && indexAxis !== "y") {
      fail('options.indexAxis must be "x" or "y"');
    }

    const config: SafeChartConfig = {
      type,
      data: {
        labels: labels?.map((l, i) => str(l, `data.labels[${i}]`) ?? ""),
        datasets: safeDatasets,
      },
      options: {
        indexAxis: indexAxis as "x" | "y" | undefined,
        title,
        legend: {
          display: bool(legendSrc?.display, "options.plugins.legend.display") ?? true,
          position: (position as "top" | "bottom" | "left" | "right") ?? "top",
        },
        scales: scales
          ? {
              x: axis(scales.x, "options.scales.x") ?? {},
              y: axis(scales.y, "options.scales.y") ?? {},
            }
          : undefined,
      },
    };
    return { ok: true, config };
  } catch (err) {
    if (err instanceof ChartConfigError) return { ok: false, error: err.message };
    throw err;
  }
}

/** A short text description of a chart for screen readers and exports. */
export function describeChart(config: SafeChartConfig): string {
  const name = config.options.title ? `"${config.options.title}"` : "Chart";
  const series = config.data.datasets
    .map((d) => d.label)
    .filter(Boolean)
    .join(", ");
  const count = config.data.labels?.length ?? config.data.datasets[0]?.data.length ?? 0;
  return `${name}: ${config.type} chart with ${config.data.datasets.length} data series${
    series ? ` (${series})` : ""
  } and ${count} data points.`;
}

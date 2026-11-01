"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { Chart as ChartInstance, ChartConfiguration } from "chart.js";
import { BarChart3 } from "lucide-react";
import {
  describeChart,
  parseChartConfig,
  type SafeChartConfig,
} from "@/lib/chart-config";
import { BlockError, CopySourceButton } from "@/components/block-chrome";
import { useNearViewport } from "@/lib/lazy-blocks";

// Categorical palette, validated for CVD separation against the app's light
// (#ffffff) and dark (#020617) surfaces. Hues are assigned in fixed order.
const PALETTE = {
  light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"],
  dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"],
};

const INK = {
  light: { text: "#334155", grid: "#e2e8f0", surface: "#ffffff" },
  dark: { text: "#cbd5e1", grid: "#1e293b", surface: "#020617" },
};

const PER_POINT_COLOR_TYPES = new Set(["pie", "doughnut", "polarArea"]);
const CARTESIAN_TYPES = new Set(["bar", "line", "scatter", "bubble"]);

function toChartJs(config: SafeChartConfig, mode: "light" | "dark"): ChartConfiguration {
  const palette = PALETTE[mode];
  const ink = INK[mode];
  const perPoint = PER_POINT_COLOR_TYPES.has(config.type);

  const datasets = config.data.datasets.map((d, i) => {
    const color = palette[i % palette.length];
    const pointColors = d.data.map((_, j) => palette[j % palette.length]);
    const isBar = (d.type ?? config.type) === "bar";
    return {
      ...d,
      backgroundColor: d.backgroundColor ?? (perPoint ? pointColors : color),
      borderColor: d.borderColor ?? (perPoint ? ink.surface : color),
      borderWidth: d.borderWidth ?? (isBar ? 0 : 2),
      ...(isBar ? { borderRadius: 4 } : {}),
    };
  });

  // Bars encode length, so their value axis starts at zero unless the author says otherwise.
  const valueAxis = config.options.indexAxis === "y" ? "x" : "y";
  const axisOptions = (axis: "x" | "y") => {
    const a = config.options.scales?.[axis] ?? {};
    return {
      beginAtZero: a.beginAtZero ?? (config.type === "bar" && axis === valueAxis),
      stacked: a.stacked,
      min: a.min,
      max: a.max,
      title: { display: Boolean(a.title), text: a.title ?? "", color: ink.text },
      ticks: { color: ink.text },
      grid: { color: ink.grid },
      border: { color: ink.grid },
    };
  };

  return {
    type: config.type,
    data: { labels: config.data.labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      indexAxis: config.options.indexAxis,
      color: ink.text,
      plugins: {
        title: {
          display: Boolean(config.options.title),
          text: config.options.title ?? "",
          color: ink.text,
          font: { size: 14, weight: "bold" },
        },
        legend: {
          display: config.options.legend?.display ?? true,
          position: config.options.legend?.position ?? "top",
          labels: { color: ink.text },
        },
        tooltip: { enabled: true },
      },
      scales: CARTESIAN_TYPES.has(config.type)
        ? { x: axisOptions("x"), y: axisOptions("y") }
        : config.type === "radar"
          ? {
              r: {
                ticks: { color: ink.text, backdropColor: "transparent" },
                grid: { color: ink.grid },
                angleLines: { color: ink.grid },
                pointLabels: { color: ink.text },
              },
            }
          : undefined,
    },
  } as ChartConfiguration;
}

function DataTable({ config }: { config: SafeChartConfig }) {
  const labels =
    config.data.labels ?? config.data.datasets[0]?.data.map((_, i) => String(i + 1)) ?? [];
  const cell = (v: unknown) =>
    v === null || v === undefined
      ? "—"
      : typeof v === "object"
        ? JSON.stringify(v)
        : String(v);
  return (
    // Tables ignore sr-only's 1px width, so the clipping lives on a wrapper.
    <div className="sr-only" data-chart-table>
    <table>
      <caption>{describeChart(config)}</caption>
      <thead>
        <tr>
          <th scope="col">Label</th>
          {config.data.datasets.map((d, i) => (
            <th key={i} scope="col">
              {d.label ?? `Series ${i + 1}`}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {labels.map((label, row) => (
          <tr key={row}>
            <th scope="row">{label}</th>
            {config.data.datasets.map((d, i) => (
              <td key={i}>{cell(d.data[row])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export function ChartBlock({ source }: { source: string }) {
  const parsed = useMemo(() => parseChartConfig(source), [source]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const [renderError, setRenderError] = useState<string | null>(null);
  const figureRef = useRef<HTMLElement>(null);
  const near = useNearViewport(figureRef);

  useEffect(() => {
    if (!near || !parsed.ok || !canvasRef.current) return;
    let chart: ChartInstance | null = null;
    let cancelled = false;
    const canvas = canvasRef.current;
    import("chart.js/auto")
      .then(({ default: Chart }) => {
        if (cancelled) return;
        try {
          chart = new Chart(canvas, toChartJs(parsed.config, mode));
          canvas.dataset.rendered = "true";
          setRenderError(null);
        } catch (err) {
          setRenderError(err instanceof Error ? err.message : String(err));
        }
      })
      .catch(() => setRenderError("Chart library failed to load."));
    return () => {
      cancelled = true;
      delete canvas.dataset.rendered;
      chart?.destroy();
    };
  }, [parsed, mode, near]);

  if (!parsed.ok || renderError) {
    return (
      <BlockError
        title="Chart could not be rendered"
        message={parsed.ok ? (renderError ?? "") : parsed.error}
        source={source}
        kind="chartjs"
      />
    );
  }

  const description = describeChart(parsed.config);
  return (
    <figure ref={figureRef} className="not-prose my-6 rounded-lg border border-border bg-card" data-chart-block>
      <div
        className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5 text-xs text-muted-foreground"
        data-export-ignore
      >
        <span className="inline-flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5" aria-hidden />
          Chart
        </span>
        <CopySourceButton source={source} />
      </div>
      <div className="relative h-80 w-full p-3">
        <canvas ref={canvasRef} role="img" aria-label={description} data-chart-canvas />
      </div>
      <DataTable config={parsed.config} />
    </figure>
  );
}

import { ImageResponse } from "next/og";

export const alt = "MDViewer — online Markdown viewer and editor with live preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const source = ["# Release notes", "", "- **Live** preview", "- Tables & task lists", "- Diagrams and math"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#2563eb",
              fontSize: 26,
            }}
          >
            M↓
          </div>
          MDViewer
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Online Markdown Viewer & Editor
          </div>
          <div style={{ fontSize: 30, color: "#cbd5e1" }}>
            Live preview · GitHub Flavored Markdown · Free and private
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "20px 24px",
              borderRadius: 14,
              background: "#1e293b",
              fontFamily: "monospace",
              fontSize: 22,
              color: "#cbd5e1",
            }}
          >
            {source.map((line, i) => (
              <div key={i} style={{ display: "flex", height: 30 }}>
                {line}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "20px 24px",
              borderRadius: 14,
              background: "#f8fafc",
              color: "#0f172a",
              fontSize: 22,
            }}
          >
            <div style={{ display: "flex", fontSize: 32, fontWeight: 800, height: 46 }}>Release notes</div>
            <div style={{ display: "flex", height: 30 }}>• <b style={{ margin: "0 6px" }}>Live</b> preview</div>
            <div style={{ display: "flex", height: 30 }}>• Tables & task lists</div>
            <div style={{ display: "flex", height: 30 }}>• Diagrams and math</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

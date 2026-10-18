import { ImageResponse } from "next/og";
import { MARK_C_PATH, MARK_E_PATH, MARK_STROKE_WIDTH, MARK_VIEWBOX } from "@/lib/brand-mark";

export const OG_SIZE = { width: 1200, height: 630 };

const NAVY = "#0b1222";
const AMBER = "#f5b83d";

/** "EC" mark used by the favicon, apple icon and social image. Plain strokes, no fonts or fetches. */
export function markElement(size: number) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: NAVY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size * 0.8} height={size * 0.8} viewBox={MARK_VIEWBOX}>
        <path
          d={MARK_E_PATH}
          fill="none"
          stroke="#ffffff"
          strokeWidth={MARK_STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={MARK_C_PATH}
          fill="none"
          stroke={AMBER}
          strokeWidth={MARK_STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Social card rendered with ImageResponse's built-in font, so the build makes no network
 * requests. The demo disclaimer is part of the image.
 */
export function brandImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: `radial-gradient(circle at 85% 10%, rgba(245,184,61,0.22), transparent 45%), ${NAVY}`,
        color: "#f1f5f9",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {markElement(64)}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 34, fontWeight: 700 }}>Emmy Capital</span>
          <span style={{ fontSize: 18, letterSpacing: 4, color: "#94a3b8" }}>FICTIONAL DEMO</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontSize: 26, color: AMBER, fontWeight: 600 }}>{eyebrow}</span>
        <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>
          {title}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          color: "#cbd5e1",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: 24,
        }}
      >
        Demo website. Not a real broker. No real trading or deposits.
      </div>
    </div>,
    OG_SIZE,
  );
}

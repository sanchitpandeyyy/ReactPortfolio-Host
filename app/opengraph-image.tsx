import { ImageResponse } from "next/og";

/**
 * Default share card for the site.
 *
 * Generated at build time from the site's own palette, so every page that has
 * no image of its own still previews as something deliberate instead of a bare
 * link. Mirrored articles override it with the article's featured image.
 */
export const alt = "Sanchit Pandey · Full-Stack Developer, Butwal, Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f2eb",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#6b6b66",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: "#0a0a0a",
              borderRadius: 3,
            }}
          />
          sanchitpandey.com.np
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#0a0a0a",
            }}
          >
            Sanchit Pandey
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 120, height: 10, background: "#d4ff3a" }} />
            <div style={{ fontSize: 38, color: "#1a1a18" }}>
              Full-Stack Developer
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#6b6b66" }}>
          Next.js · TypeScript · Prisma · Postgres — building from Butwal, Nepal
        </div>
      </div>
    ),
    size,
  );
}

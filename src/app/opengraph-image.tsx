import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Arbafix - Professional Video Game Console Repair";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e293b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "white",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              fontWeight: 800,
            }}
          >
            A
          </div>
          <div style={{ fontSize: "56px", fontWeight: 800 }}>Arbafix</div>
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: "28px",
            maxWidth: "920px",
          }}
        >
          Professional Video Game Console Repair
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#dbeafe",
            marginBottom: "40px",
            maxWidth: "920px",
          }}
        >
          Nintendo · PlayStation · Xbox · Retro · 90-day warranty
        </div>
        <div
          style={{
            display: "flex",
            gap: "40px",
            fontSize: "26px",
            color: "#fde68a",
            fontWeight: 600,
          }}
        >
          <div>1,148+ eBay reviews</div>
          <div>· 100% positive</div>
          <div>· Hershey, PA</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

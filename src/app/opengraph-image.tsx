import { ImageResponse } from "next/og";

export const alt = "Chá de casa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#f7f1e8",
          color: "#2a241c",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 24,
            background: "#c45c26",
            marginBottom: 36,
          }}
        >
          <svg width="52" height="52" viewBox="0 0 32 32">
            <path
              fill="#fffbf5"
              d="M16 6.5 27 16.2h-2.4V25H19v-6.2h-6V25H7.4V16.2H5L16 6.5z"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          Chá de casa
        </div>
        <div style={{ marginTop: 18, fontSize: 32, color: "#6f6558" }}>
          Com carinho, da nossa casa nova
        </div>
      </div>
    ),
    { ...size },
  );
}

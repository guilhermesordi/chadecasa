import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c45c26",
          borderRadius: 40,
        }}
      >
        <svg width="118" height="118" viewBox="0 0 32 32">
          <path
            fill="#fffbf5"
            d="M16 6.5 27 16.2h-2.4V25H19v-6.2h-6V25H7.4V16.2H5L16 6.5z"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Verwende dein SVG direkt aus dem public Ordner */}
        <img
          src={new URL(
            "/images/icon.svg",
            process.env.NEXT_PUBLIC_URL
          ).toString()}
          alt="Todo Stream Logo"
          style={{
            width: "90%",
            height: "90%",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

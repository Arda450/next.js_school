import { ImageResponse } from "next/og";
import Image from "next/image";

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
        <Image
          src="/images/icon.svg"
          alt="Todo Stream Logo"
          width={size.width * 0.9}
          height={size.height * 0.9}
          priority
          style={{
            width: "90%",
            height: "90%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

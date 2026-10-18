import { ImageResponse } from "next/og";
import { markElement } from "@/lib/og/brand-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(markElement(32), size);
}

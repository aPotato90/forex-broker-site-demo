import { DEFAULT_OG_IMAGE_ALT } from "@/lib/metadata";
import { brandImage, OG_SIZE } from "@/lib/og/brand-image";

export const alt = DEFAULT_OG_IMAGE_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return brandImage({
    eyebrow: "Portfolio demo by Emmanuel Kelvin",
    title: "Global markets, simulated end to end.",
  });
}

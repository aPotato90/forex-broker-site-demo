import { brandImage, OG_SIZE } from "@/lib/og/brand-image";

export const alt = "Valtrex Markets, a fictional forex broker demo website";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return brandImage({
    eyebrow: "Portfolio demo by Emmanuel Kelvin",
    title: "Global markets, simulated end to end.",
  });
}

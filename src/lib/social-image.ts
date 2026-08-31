import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOCIAL_IMAGE_WIDTH = 1200;
const SOCIAL_IMAGE_HEIGHT = 630;

export type SocialImageKind = "blog" | "handbook";

const SOCIAL_IMAGE_VERSION = "3";
const FONT_PATH = fileURLToPath(new URL("../assets/fonts/JetBrainsMono[wght].ttf", import.meta.url));
const COLORS = {
  accent: "#dca72c",
  background: "#0a0a0a",
  grid: "#131313",
  text: "#e9e4da",
};
const GRID = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${SOCIAL_IMAGE_WIDTH}" height="${SOCIAL_IMAGE_HEIGHT}">
    <defs>
      <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M 28 0 L 0 0 0 28" fill="none" stroke="${COLORS.grid}" stroke-width="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    <path d="M572 126.5h56" stroke="${COLORS.accent}" stroke-width="3" />
  </svg>
`);

interface TextImage {
  data: Buffer;
  height: number;
  width: number;
}

function escapePango(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function renderText(
  text: string,
  {
    align = "left",
    color,
    font,
    spacing = 0,
    width,
  }: {
    align?: "center" | "left" | "right";
    color: string;
    font: string;
    spacing?: number;
    width?: number;
  },
): Promise<TextImage> {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}">${escapePango(text)}</span>`,
      font,
      fontfile: FONT_PATH,
      width,
      align,
      spacing,
      wrap: "word-char",
      rgba: true,
      dpi: 96,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });

  return { data, height: info.height, width: info.width };
}

export function socialImageName(kind: SocialImageKind, slug: string, title: string): string {
  if (!slug || slug.startsWith("/") || slug.includes("..")) throw new Error(`Invalid social image slug: ${slug}`);

  const hash = createHash("sha256").update(`${SOCIAL_IMAGE_VERSION}\0${title}`).digest("hex").slice(0, 8);
  return `${kind}/${slug}-${hash}`;
}

export function socialImagePath(kind: SocialImageKind, slug: string, title: string): string {
  return `/social/${socialImageName(kind, slug, title)}.png`;
}

export async function renderSocialImage(title: string): Promise<Buffer> {
  const cleanTitle = title.trim();
  if (!cleanTitle) throw new Error("Social image title cannot be empty");

  const [domain, heading] = await Promise.all([
    renderText("davidgasquez.com", {
      color: COLORS.accent,
      font: "JetBrains Mono SemiBold 16",
    }),
    renderText(cleanTitle, {
      align: "center",
      color: COLORS.text,
      font: "JetBrains Mono Bold 50",
      spacing: 8,
      width: 980,
    }),
  ]);

  return sharp({
    create: {
      width: SOCIAL_IMAGE_WIDTH,
      height: SOCIAL_IMAGE_HEIGHT,
      channels: 4,
      background: COLORS.background,
    },
  })
    .composite([
      { input: GRID, left: 0, top: 0 },
      { input: domain.data, left: Math.round((SOCIAL_IMAGE_WIDTH - domain.width) / 2), top: 82 },
      {
        input: heading.data,
        left: Math.round((SOCIAL_IMAGE_WIDTH - heading.width) / 2),
        top: Math.round(326 - heading.height / 2),
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 100 })
    .toBuffer();
}

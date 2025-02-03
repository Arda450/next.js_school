export const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "bottts",
  "funEmoji",
  "lorelei",
  "notionists",
  "openPeeps",
  "personas",
  "pixelArt",
] as const;

export type AvatarStyle = (typeof AVATAR_STYLES)[number];

export function generateAvatarUrl(style: AvatarStyle, seed: string): string {
  const timestamp = new Date().getTime();
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(
    seed
  )}&timestamp=${timestamp}`;
}

export const AVATAR_STYLES = [
  "initials",
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "avataaars-neutral",
  "fun-emoji",
  "bottts",
  "lorelei",
  "notionists",
  "personas",
  "croodles",
  "bottts-neutral",
  "icons",
] as const;

export type AvatarStyle = (typeof AVATAR_STYLES)[number];

export function generateAvatarUrl(style: AvatarStyle, seed: string): string {
  const timestamp = new Date().getTime();
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(
    seed
  )}&timestamp=${timestamp}`;
}

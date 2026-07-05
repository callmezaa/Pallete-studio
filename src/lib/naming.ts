const ADJECTIVES = [
  "Midnight", "Ocean", "Sunset", "Polar", "Forest", "Desert", "Aurora",
  "Crimson", "Frost", "Shadow", "Golden", "Silver", "Cobalt", "Ruby",
  "Emerald", "Amber", "Sapphire", "Rose", "Slate", "Ivory",
];

const NOUNS = [
  "Graphite", "Breeze", "Coral", "Mist", "Moss", "Gold", "Sky",
  "Dawn", "Storm", "Flame", "Night", "Dust", "Cloud", "Leaf",
  "Stone", "Velvet", "Ocean", "Mountain", "River", "Sand",
];

function hashHex(hex: string): number {
  let hash = 0;
  for (let i = 0; i < hex.length; i++) {
    hash = ((hash << 5) - hash) + hex.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateColorName(hex: string): string {
  const h = hashHex(hex);
  const adj = ADJECTIVES[h % ADJECTIVES.length];
  const noun = NOUNS[(h * 31) % NOUNS.length];
  return `${adj} ${noun}`;
}

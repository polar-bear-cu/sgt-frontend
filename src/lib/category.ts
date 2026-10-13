const CATEGORY_COLORS: Record<string, string> = {
  technology: "#7a2020",
  streaming: "#b8871f",
  productivity: "#0e7c86",
  music: "#6b4fbb",
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#8c8378";
}

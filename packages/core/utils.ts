export function isIgnoredLine(line: string): boolean {
  const trimmedline = line.trim();
  return trimmedline.length === 0 || trimmedline.startsWith("#");
}

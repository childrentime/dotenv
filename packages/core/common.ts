export function trimPrefix(s: string, prefix: string) {
  if (s.startsWith(prefix)) {
    return s.substring(prefix.length);
  }
  return s;
}

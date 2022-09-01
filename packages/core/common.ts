export function trimPrefix(s: string, prefix: string) {
  if (s.startsWith(prefix)) {
    return s.substring(prefix.length);
  }
  return s;
}

const doubleQuoteSpecialChars = '\\\n\r"';
export function doubleQuoteEscape(line: string): string {
  for (const char of doubleQuoteSpecialChars) {
    let toReplace = "\\" + char;
    if (char == "\n") {
      toReplace = "\\n";
    }
    if (char == "\r") {
      toReplace = "\\r";
    }
    line = line.replaceAll(char, toReplace);
  }
  return line;
}

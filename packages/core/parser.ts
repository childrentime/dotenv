import { trimPrefix } from "./common";

export default class Parser {
  private map = new Map<string, string>();

  public parse(file: string): Map<string, string> {
    this.map = new Map();
    const LINE =
      /(?:^|\A)\s*(?:export\s+)?([\w.]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|[^\#\r\n]+)?\s*(?:\#.*)?(?:$|\z)/gm;

    const lines = file.replace(/\r\n?/gm, "\n");
    // Process matches
    let match;
    while ((match = LINE.exec(lines))) {
      const key = match[1];
      // Default undefined or null to empty string
      const valueString = match[2] || "";
      const value = this.parseValue(valueString);
      this.map.set(key, value);
    }
    return this.map;
  }

  private parseValue(value: string): string {
    const singleQuotesRegex = /^'(.*)'$/;
    const doubleQuotesRegex = /^"(.*)"$/;
    const escapeRegex = /\\./g;
    const unescapeCharsRegex = /\\([^$])/g;

    value = value.trim();

    // check if we've got quoted values or possible escapes
    if (value.length > 1) {
      const singleQoutes = value.match(singleQuotesRegex);
      const doubleQoutes = value.match(doubleQuotesRegex);

      if (singleQoutes != null || doubleQoutes != null) {
        // pull the quotes off the edges
        value = value.substring(1, value.length - 1);
      }

      // doubelQouts should expand
      if (doubleQoutes != null) {
        // expand newlines
        value = value.replaceAll(escapeRegex, (match: string) => {
          const c = trimPrefix(match, "\\");
          switch (c) {
            case "n":
              return "\n";
            case "r":
              return "\r";
            default:
              return match;
          }
        });
        // unescape characters
        value = value.replaceAll(unescapeCharsRegex, "$1");
      }

      if (singleQoutes === null) {
        value = this.expandVariables(value);
      }
    }

    return value;
  }
  private expandVariables(v: string): string {
    const expandVarRegex = /(\\)?(\$)(\()?\{?([A-Z0-9_]+)?\}?/gy;
    return v.replaceAll(expandVarRegex, (match: string) => {
      const submatch = match.split(expandVarRegex);
      if (submatch === null) {
        return match;
      }
      if (submatch[1] == "\\" || submatch[2] == "(") {
        return submatch[0].substring(1, submatch[0].length);
      } else if (submatch[4] != "") {
        return this.map.get(submatch[4]) || "";
      }
      return match;
    });
  }
}

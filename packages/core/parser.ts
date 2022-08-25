import { count, splitN, trimPrefix } from "./common";
import { isIgnoredLine } from "./utils";

export default class Parser {
  private map = new Map<string, string>();
  public parse(file: string): Map<string, string> {
    this.map = new Map();
    const lines: string[] = file.split(/\r?\n/);
    for (const line of lines) {
      if (!isIgnoredLine(line)) {
        const [key, value] = this.parseLine(line);
        this.map.set(key, value);
      }
    }
    return this.map;
  }

  private parseLine(line: string) {
    const exportRegex = /^\s*(?:export\s+)?(.*?)\s*$/g;
    if (line.length === 0) {
      throw new Error("zero length string");
    }

    // ditch the comments (but keep quoted hashes)
    if (line.includes("#")) {
      const segmentsBetweenHashed = line.split("#");
      let quotesAreOpen = false;
      const segmentsToKeep: string[] = [];
      for (const segment of segmentsBetweenHashed) {
        if (count(segment, '"') === 1 || count(segment, "'") === 1) {
          if (quotesAreOpen) {
            quotesAreOpen = false;
            segmentsToKeep.push(segment);
          } else {
            quotesAreOpen = true;
          }
        }

        if (segmentsToKeep.length === 0 || quotesAreOpen) {
          segmentsToKeep.push(segment);
        }
      }
      line = segmentsToKeep.join("#");
    }

    const firstEquals = line.indexOf("=");
    const firstColon = line.indexOf(":");
    let splitString = splitN(line, "=", 2);
    if (firstColon != -1 && (firstColon < firstEquals || firstEquals === -1)) {
      // this is a yaml-style line
      splitString = splitN(line, ":", 2);
    }

    if (splitString.length !== 2) {
      throw new Error("Can't separate key from value");
    }

    // Parse the key
    const key = splitString[0].replaceAll(exportRegex, "$1");
    // Parse the value
    const value = this.parseValue(splitString[1]);
    return [key, value];
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
          const c = trimPrefix(match, `\\`);
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
        return submatch[0].substring(1);
      } else if (submatch[4] != "") {
        return this.map.get(submatch[4]) || "";
      }
      return match;
    });
  }
}

import fs from "fs";
import { count, splitN, trimPrefix } from "./common";

class DotEnv {
  public load(...filenames: string[]): void {
    filenames = this.filenamesOrDefault(filenames);
    for (const filename of filenames) {
      this.loadFile(filename, false);
    }
  }
  public overload(...filenames: string[]) {
    filenames = this.filenamesOrDefault(filenames);
    for (const filename of filenames) {
      this.loadFile(filename, true);
    }
  }
  public parse(file: string): Map<string, string> {
    const map = new Map<string, string>();
    const lines: string[] = file.split(/\r?\n/);
    for (const line of lines) {
      if (!this.isIgnoredLine(line)) {
        const [key, value] = this.parseLine(line, map);
        map.set(key, value);
      }
    }
    return map;
  }

  private filenamesOrDefault(filenames: string[]): string[] {
    if (filenames.length == 0) {
      return [".env"];
    }
    return filenames;
  }
  private loadFile(filename: string, overload: boolean): void {
    const map = this.readFile(filename);
    for (const [key, value] of map) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = value;
      } else {
        if (overload) {
          process.env[key] = value;
        }
      }
    }
  }
  private readFile(filename: string) {
    try {
      const file = fs.readFileSync(filename, "utf-8");
      return this.parse(file);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
  private parseLine(line: string, map: Map<string, string>) {
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
    let key = splitString[0];
    if (key.startsWith("export")) {
      key = trimPrefix(key, "export").trim();
    }

    key = key.replaceAll(exportRegex, "$1");

    // Parse the value
    const value = this.parseValue(splitString[1], map);
    return [key, value];
  }
  private parseValue(value: string, map: Map<string, string>): string {
    const singleQuotesRegex = /\A'(.*)'\z/;
    const doubleQuotesRegex = /\A"(.*)"\z/;
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
        value = this.expandVariables(value, map);
      }
    }

    return value;
  }
  private expandVariables(v: string, map: Map<string, string>): string {
    const expandVarRegex = /(\\)?(\$)(\()?\{?([A-Z0-9_]+)?\}?/g;
    return v.replaceAll(expandVarRegex, (match: string) => {
      const submatch = v.match(match);
      if (submatch === null) {
        return match;
      }
      if (submatch[1] == "\\" || submatch[2] == "(") {
        return submatch[0].substring(1);
      } else if (submatch[4] != "") {
        return map.get(submatch[4])!;
      }
      return match;
    });
  }
  private isIgnoredLine(line: string): boolean {
    const trimmedline = line.trim();
    return trimmedline.length === 0 || trimmedline.startsWith("#");
  }
}

export default new DotEnv();

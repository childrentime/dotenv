import fs from "fs";
import { Options } from "./types";
import Parser from "./parser";
import { doubleQuoteEscape } from "./common";
const spawn = require("cross-spawn");

class DotEnv {
  private parser = new Parser();
  public load(
    filenames: string[],
    options: Options = {
      override: false,
    }
  ): void {
    const { override } = options;
    for (const filename of filenames) {
      this.loadFile(filename, override);
    }
  }
  public parse(file: string): Map<string, string> {
    return this.parser.parse(file);
  }
  public exec(filenames: string[], cmd: string, cmdArgs: string[]) {
    this.load(filenames, { override: true });
    const ls = spawn.sync(cmd, cmdArgs, { env: process.env });
    return ls.stdout.toString("utf-8");
  }
  public write(map: Map<string, string>, filename: string): boolean {
    const lines = this.marshal(map).concat("\n");
    try {
      fs.writeFileSync(filename, lines);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public marshal(map: Map<string, string>): string {
    const lines: string[] = [];
    for (const [key, value] of map) {
      if (!isNaN(parseInt(value))) {
        lines.push(`${key}=${value}`);
      } else {
        lines.push(`${key}="${doubleQuoteEscape(value)}"`);
      }
    }
    return lines.join("\n");
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
  private readFile(filename: string): Map<string, string> {
    try {
      const file = fs.readFileSync(filename, "utf-8");
      return this.parse(file);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

export default new DotEnv();

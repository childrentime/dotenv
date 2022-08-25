import fs from "fs";
import { ArrRange, Options } from "./types";
import Parser from "./parser";

class DotEnv {
  public parser = new Parser();
  public load(
    filenames: ArrRange<1, 20, string>,
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

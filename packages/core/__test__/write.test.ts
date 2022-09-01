import dotenv from "../";
import path from "path";
import fs from "fs";

describe("write", () => {
  it("write map to file", () => {
    const map = new Map();
    map.set("BASIC", "basic");
    map.set("KEY", "value");
    const filepath = path.resolve(__dirname, "./jsfile/.env");
    dotenv.write(map, filepath);
    const newMap = dotenv.parse(fs.readFileSync(filepath, "utf-8"));
    expect([...map]).toStrictEqual([...newMap]);
  });
});

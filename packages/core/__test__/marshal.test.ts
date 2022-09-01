import dotenv from "../";
import path from "path";
import fs from "fs";

describe("marshal", () => {
  it("marshal map", () => {
    const pathname = path.resolve(__dirname, "./env/.env");
    const file = fs.readFileSync(pathname, "utf-8");
    const map = dotenv.parse(file);
    const lines = dotenv.marshal(map);
    const newMap = dotenv.parse(lines);
    expect([...map]).toStrictEqual([...newMap]);
  });
});

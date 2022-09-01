import path from "path";
import dotenv from "../";

describe("exec", () => {
  it("exec bash command", () => {
    const pathname = path.resolve(__dirname + "/env/.env");
    const out = dotenv.exec([pathname], "bash", ["-c", 'echo "$BASIC"']);
    expect(out).toBe("basic\n");
  });

  it("exec nodejs command", () => {
    const pathname = path.resolve(__dirname, "./jsfile/hello.js");
    const out = dotenv.exec([], "node", [pathname]);
    expect(out).toEqual("hello world\n");
  });
});

import dotenv from "../";

describe("load", () => {
  it("loadenv", () => {
    const path = __dirname + "/env/.env";
    dotenv.load([path]);
    expect(process.env["BASIC"]).toEqual("basic");
  });

  it("overloadenv", () => {
    process.env["BASIC"] = "bas";
    expect(process.env["BASIC"]).toEqual("bas");
    const path = __dirname + "/env/.env";
    dotenv.load([path]);
    expect(process.env["BASIC"]).toEqual("bas");
    dotenv.load([path], { override: true });
    expect(process.env["BASIC"]).toEqual("basic");
  });
});

import dotenv from "../";

describe("load", () => {
  it("loadenv", () => {
    const path = __dirname + "/env/.env";
    dotenv.load([path]);
  });
});

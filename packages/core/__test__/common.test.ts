import { trimPrefix } from "../common";
describe("common", () => {
  it("trimPrefix", () => {
    const str = "export123";
    const trimStr = trimPrefix(str, "export");
    const noTrimStr = trimPrefix(str, "import");
    expect(trimStr).toEqual("123");
    expect(noTrimStr).toEqual("export123");

    const escapeStr = `\\test`;
    const trimEscapeStr = trimPrefix(escapeStr, "\\");
    expect(trimEscapeStr).toEqual("test");
  });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
describe("common", () => {
    it("splitN", () => {
        const str = "a#bc#da#dsad#";
        const splitStr1 = (0, common_1.splitN)(str, "#", 1);
        const splitStr3 = (0, common_1.splitN)(str, "#", 3);
        const splitStr2 = (0, common_1.splitN)(str, "#", 2);
        const splitStr5 = (0, common_1.splitN)(str, "#", 5);
        expect(splitStr1).toStrictEqual(["a#bc#da#dsad#"]);
        expect(splitStr2).toStrictEqual(["a", "bc#da#dsad#"]);
        expect(splitStr3).toStrictEqual(["a", "bc", "da#dsad#"]);
        expect(splitStr5).toStrictEqual(["a", "bc", "da", "dsad", ""]);
    });
    it("trimPrefix", () => {
        const str = "export123";
        const trimStr = (0, common_1.trimPrefix)(str, "export");
        const noTrimStr = (0, common_1.trimPrefix)(str, "import");
        expect(trimStr).toEqual("123");
        expect(noTrimStr).toEqual("export123");
        const escapeStr = `\\test`;
        const trimEscapeStr = (0, common_1.trimPrefix)(escapeStr, "\\");
        expect(trimEscapeStr).toEqual("test");
    });
});

import dotenv from "../";
import fs from "fs";

describe("parse", () => {
  it("parse normal env", () => {
    const file = fs.readFileSync(__dirname + "/env/.env", "utf-8");
    const map = dotenv.parse(file);
    const arr = [...map];
    console.log(arr);
    expect(arr).toStrictEqual([
      ["BASIC", "basic"],
      ["AFTER_LINE", "after_line"],
      ["EMPTY", ""],
      ["EMPTY_SINGLE_QUOTES", ""],
      ["EMPTY_DOUBLE_QUOTES", ""],
      ["EMPTY_BACKTICKS", "``"],
      ["SINGLE_QUOTES", "single_quotes"],
      ["SINGLE_QUOTES_SPACED", "    single quotes    "],
      ["DOUBLE_QUOTES", "double_quotes"],
      ["DOUBLE_QUOTES_SPACED", "    double quotes    "],
      [
        "DOUBLE_QUOTES_INSIDE_SINGLE",
        'double "quotes" work inside single quotes',
      ],
      ["DOUBLE_QUOTES_WITH_NO_SPACE_BRACKET", "{ port: $MONGOLAB_PORT}"],
      [
        "SINGLE_QUOTES_INSIDE_DOUBLE",
        "single 'quotes' work inside double quotes",
      ],
      ["BACKTICKS_INSIDE_SINGLE", "`backticks` work inside single quotes"],
      ["BACKTICKS_INSIDE_DOUBLE", "`backticks` work inside double quotes"],
      ["BACKTICKS", "`backticks`"],
      ["BACKTICKS_SPACED", "`    backticks    `"],
      [
        "DOUBLE_QUOTES_INSIDE_BACKTICKS",
        '`double "quotes" work inside backticks`',
      ],
      [
        "SINGLE_QUOTES_INSIDE_BACKTICKS",
        "`single 'quotes' work inside backticks`",
      ],
      [
        "DOUBLE_AND_SINGLE_QUOTES_INSIDE_BACKTICKS",
        "`double \"quotes\" and single 'quotes' work inside backticks`",
      ],
      ["EXPAND_NEWLINES", "expand\nnew\nlines\rb"],
      ["DONT_EXPAND_UNQUOTED", "dontexpand\\nnewlines"],
      ["DONT_EXPAND_SQUOTED", "dontexpand\\nnewlines"],
      ["INLINE_COMMENTS", "inline comments"],
      [
        "INLINE_COMMENTS_SINGLE_QUOTES",
        "inline comments outside of #singlequotes",
      ],
      [
        "INLINE_COMMENTS_DOUBLE_QUOTES",
        "inline comments outside of #doublequotes",
      ],
      ["INLINE_COMMENTS_BACKTICKS", "`inline comments outside of"],
      ["INLINE_COMMENTS_SPACE", "inline comments start with a"],
      ["EQUAL_SIGNS", "equals=="],
      ["RETAIN_INNER_QUOTES", '{"foo": "bar"}'],
      ["RETAIN_INNER_QUOTES_AS_STRING", '{"foo": "bar"}'],
      ["RETAIN_INNER_QUOTES_AS_BACKTICKS", '`{"foo": "bar\'s"}`'],
      ["TRIM_SPACE_FROM_UNQUOTED", "some spaced out string"],
      ["USERNAME", "therealnerdybeast@example.tld"],
      ["SPACED_KEY", "parsed"],
      ["OPTION_A", "postgres://localhost:5432/database?sslmode=disable"],
    ]);
  });

  it("parse yaml env", () => {
    const file = fs.readFileSync(__dirname + "/env/yml.env", "utf-8");
    const map = dotenv.parse(file);
    const arr = [...map];
    expect(arr).toStrictEqual([
      ["BASIC", "basic"],
      ["AFTER_LINE", "after_line"],
      ["EMPTY", ""],
      ["EMPTY_SINGLE_QUOTES", ""],
      ["EMPTY_DOUBLE_QUOTES", ""],
      ["EMPTY_BACKTICKS", "``"],
      ["SINGLE_QUOTES", "single_quotes"],
      ["SINGLE_QUOTES_SPACED", "    single quotes    "],
      ["DOUBLE_QUOTES", "double_quotes"],
      ["DOUBLE_QUOTES_SPACED", "    double quotes    "],
      [
        "DOUBLE_QUOTES_INSIDE_SINGLE",
        'double "quotes" work inside single quotes',
      ],
      ["DOUBLE_QUOTES_WITH_NO_SPACE_BRACKET", "{ port: $MONGOLAB_PORT}"],
      [
        "SINGLE_QUOTES_INSIDE_DOUBLE",
        "single 'quotes' work inside double quotes",
      ],
      ["BACKTICKS_INSIDE_SINGLE", "`backticks` work inside single quotes"],
      ["BACKTICKS_INSIDE_DOUBLE", "`backticks` work inside double quotes"],
      ["BACKTICKS", "`backticks`"],
      ["BACKTICKS_SPACED", "`    backticks    `"],
      [
        "DOUBLE_QUOTES_INSIDE_BACKTICKS",
        '`double "quotes" work inside backticks`',
      ],
      [
        "SINGLE_QUOTES_INSIDE_BACKTICKS",
        "`single 'quotes' work inside backticks`",
      ],
      [
        "DOUBLE_AND_SINGLE_QUOTES_INSIDE_BACKTICKS",
        "`double \"quotes\" and single 'quotes' work inside backticks`",
      ],
      ["EXPAND_NEWLINES", "expand\nnew\nlines\rb"],
      ["DONT_EXPAND_UNQUOTED", "dontexpand\\nnewlines"],
      ["DONT_EXPAND_SQUOTED", "dontexpand\\nnewlines"],
      ["INLINE_COMMENTS", "inline comments"],
      [
        "INLINE_COMMENTS_SINGLE_QUOTES",
        "inline comments outside of #singlequotes",
      ],
      [
        "INLINE_COMMENTS_DOUBLE_QUOTES",
        "inline comments outside of #doublequotes",
      ],
      ["INLINE_COMMENTS_BACKTICKS", "`inline comments outside of"],
      ["INLINE_COMMENTS_SPACE", "inline comments start with a"],
      ["EQUAL_SIGNS", "equals=="],
      ["RETAIN_INNER_QUOTES", '{"foo": "bar"}'],
      ["RETAIN_INNER_QUOTES_AS_STRING", '{"foo": "bar"}'],
      ["RETAIN_INNER_QUOTES_AS_BACKTICKS", '`{"foo": "bar\'s"}`'],
      ["TRIM_SPACE_FROM_UNQUOTED", "some spaced out string"],
      ["USERNAME", "therealnerdybeast@example.tld"],
      ["SPACED_KEY", "parsed"],
      ["OPTION_A", "postgres://localhost:5432/database?sslmode=disable"],
    ]);
  });

  it("parse substitutions env", () => {
    const file = fs.readFileSync(__dirname + "/env/substitutions.env", "utf-8");
    const map = dotenv.parse(file);
    const arr = [...map];
    expect(arr).toStrictEqual([
      ["OPTION_A", "1"],
      ["OPTION_B", "1"],
      ["OPTION_C", "1"],
      ["OPTION_D", "11"],
      ["OPTION_E", ""],
    ]);
  });
});

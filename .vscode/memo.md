// some maybe useful code segment

```ts
lines
  .replaceAll(LINE, "")
  .split(/[\n\r]+/)
  .forEach((line) => {
    this.parseLine(line);
  });
```

```ts
 private parseLine(line: string) {
    const exportRegex = /^\s*(?:export\s+)?(.*?)\s*$/g;
    if (line.length === 0) {
      throw new Error("zero length string");
    }

    // ditch the comments (but keep quoted hashes)
    if (line.includes("#")) {
      const segmentsBetweenHashed = line.split("#");
      let quotesAreOpen = false;
      const segmentsToKeep: string[] = [];
      for (const segment of segmentsBetweenHashed) {
        if (count(segment, '"') === 1 || count(segment, "'") === 1) {
          if (quotesAreOpen) {
            quotesAreOpen = false;
            segmentsToKeep.push(segment);
          } else {
            quotesAreOpen = true;
          }
        }

        if (segmentsToKeep.length === 0 || quotesAreOpen) {
          segmentsToKeep.push(segment);
        }
      }
      line = segmentsToKeep.join("#");
    }

    const firstEquals = line.indexOf("=");
    const firstColon = line.indexOf(":");
    let splitString = splitN(line, "=", 2);
    if (firstColon != -1 && (firstColon < firstEquals || firstEquals === -1)) {
      // this is a yaml-style line
      splitString = splitN(line, ":", 2);
    }

    if (splitString.length !== 2) {
      console.log(this.map);
      console.log(line, splitString);
      throw new Error("Can't separate key from value");
    }

    // Parse the key
    const key = splitString[0].replaceAll(exportRegex, "$1");
    // Parse the value
    const value = this.parseValue(splitString[1]);
    return [key, value];
  }
```

```ts
export const splitN = (str: string, sep: string, n: number) => {
  const res: string[] = [];
  let i = 0;
  let index = 0;
  n--;
  while (n != 0) {
    index = str.indexOf(sep, i);
    if (index < 0) {
      break;
    }
    res.push(str.substring(0, index));
    str = str.substring(index + sep.length);
    n--;
  }
  res.push(str);
  return res;
};

export function count(s: string, substr: string): number {
  return s.match(new RegExp(substr, "g"))?.length || 0;
}

it("splitN", () => {
  const str = "a#bc#da#dsad#";
  const splitStr1 = splitN(str, "#", 1);
  const splitStr3 = splitN(str, "#", 3);
  const splitStr2 = splitN(str, "#", 2);
  const splitStr5 = splitN(str, "#", 5);
  expect(splitStr1).toStrictEqual(["a#bc#da#dsad#"]);
  expect(splitStr2).toStrictEqual(["a", "bc#da#dsad#"]);
  expect(splitStr3).toStrictEqual(["a", "bc", "da#dsad#"]);
  expect(splitStr5).toStrictEqual(["a", "bc", "da", "dsad", ""]);
});
```

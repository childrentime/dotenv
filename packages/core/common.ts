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
export function trimPrefix(s: string, prefix: string) {
  if (s.startsWith(prefix)) {
    return s.substring(prefix.length);
  }
  return s;
}

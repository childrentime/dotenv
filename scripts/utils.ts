import path from "path";
import jsonfile from "jsonfile";

const rootDir = path.resolve(__dirname, "..");
function packageJson(packageName: string, directory = "") {
  return path.join(rootDir, directory, packageName, "package.json");
}

export async function getPackageVersion(packageName: string) {
  let file = packageJson(packageName, "packages");
  let json = await jsonfile.readFile(file);
  return json.version;
}

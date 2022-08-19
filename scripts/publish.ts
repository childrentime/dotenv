import path from "path";
import { execSync } from "child_process";
import semver from "semver";

const buildDir = path.resolve(__dirname, "../build/node_modules");

const getTaggedVersion = () => {
  let output = execSync("git tag --list --points-at HEAD").toString().trim();
  return output.replace(/^v/g, "");
};

const publish = (dir: string, tag: string) => {
  execSync(`npm publish --access public --tag ${tag} ${dir}`, {
    stdio: "inherit",
  });
};

const run = async () => {
  const taggedVersion = getTaggedVersion();
  if (taggedVersion === "") {
    console.error("Missing release version. Run the version script first.");
    process.exit(1);
  }
  let prerelease = semver.prerelease(taggedVersion);
  let prereleaseTag = prerelease ? String(prerelease[0]) : undefined;
  let tag = prereleaseTag
    ? prereleaseTag.includes("nightly")
      ? "nightly"
      : prereleaseTag.includes("experimental")
      ? "experimental"
      : prereleaseTag
    : "latest";
  for (const name of ["core", "autoload"]) {
    publish(path.join(buildDir, "@dotenv", name), tag);
  }
};

run().then(
  () => {
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  }
);

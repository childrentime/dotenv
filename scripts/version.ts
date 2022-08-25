import { execSync } from "child_process";
import { getPackageVersion } from "./utils";

const run = async () => {
  const currentVersion = await getPackageVersion("core");
  execSync(`git commit --all --message="Version ${currentVersion}"`);
  execSync(`git tag -a -m "Version ${currentVersion}" v${currentVersion}`);
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

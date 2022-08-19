import path from "path";
import jsonfile from "jsonfile";
import chalk from "chalk";
import { execSync } from "child_process";

const rootDir = path.resolve(__dirname, "..");
const allPackages = ["core", "autoload"];
function packageJson(packageName: string, directory = "") {
  return path.join(rootDir, directory, packageName, "package.json");
}

async function getPackageVersion(packageName: string) {
  let file = packageJson(packageName, "packages");
  console.log(file);
  let json = await jsonfile.readFile(file);
  return json.version;
}

function ensureCleanWorkingDirectory() {
  let status = execSync(`git status --porcelain`).toString().trim();
  let lines = status.split("\n");
  if (!lines.every((line) => line === "" || line.startsWith("?"))) {
    console.error(
      "Working directory is not clean. Please commit or stash your changes."
    );
    process.exit(1);
  }
}

async function updatePackageConfig(
  packageName: string,
  transform: (config: any) => any
) {
  let file = packageJson(packageName, "packages");
  try {
    let json = await jsonfile.readFile(file);
    if (!json) {
      console.log(`No package.json found for ${packageName}; skipping`);
      return;
    }
    transform(json);
    await jsonfile.writeFile(file, json, { spaces: 2 });
  } catch (err) {
    return;
  }
}

async function updateVersion(
  packageName: string,
  nextVersion: string,
  successMessage?: string
) {
  await updatePackageConfig(packageName, (config) => {
    config.version = nextVersion;
    for (let pkg of allPackages) {
      if (config.dependencies?.[`@jsdotenv/${pkg}`]) {
        config.dependencies[`@jsdotenv/${pkg}`] = nextVersion;
      }
      if (config.devDependencies?.[`@jsdotenv/${pkg}`]) {
        config.devDependencies[`@jsdotenv/${pkg}`] = nextVersion;
      }
      if (config.peerDependencies?.[`@jsdotenv/${pkg}`]) {
        config.peerDependencies[`@jsdotenv/${pkg}`] = nextVersion;
      }
    }
  });
  let logName = packageName.startsWith("remix-")
    ? `@jsdotenv/${packageName.slice(6)}`
    : packageName;
  console.log(
    chalk.green(
      `  ${
        successMessage ||
        `Updated ${chalk.bold(logName)} to version ${chalk.bold(nextVersion)}`
      }`
    )
  );
}

async function incrementVersion(nextVersion: string) {
  // Update version numbers in package.json for all packages
  for (let name of allPackages) {
    await updateVersion(name, nextVersion);
  }

  // Commit and tag
  execSync(`git commit --all --message="Version ${nextVersion}"`);
  execSync(`git tag -a -m "Version ${nextVersion}" v${nextVersion}`);
  console.log(chalk.green(`  Committed and tagged version ${nextVersion}`));
}

export { getPackageVersion, ensureCleanWorkingDirectory, incrementVersion };

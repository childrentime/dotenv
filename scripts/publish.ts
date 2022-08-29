import path from "path";
import { execSync } from "child_process";

const buildDir = path.resolve(__dirname, "../build/node_modules");
const createDir = path.resolve(
  __dirname,
  "../build/node_modules/create-dotenv"
);

const publish = (dir: string, tag: string) => {
  execSync(`npm publish --access public --tag ${tag} ${dir}`, {
    stdio: "inherit",
  });
};

const run = async () => {
  const tag = "latest";
  for (const name of ["core"]) {
    publish(path.join(buildDir, "@jsdotenv", name), tag);
  }
  publish(createDir, tag);
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

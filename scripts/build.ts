import { spawn } from "cross-spawn";
import { deleteAsync } from "del";

const exec = (command: string, args: string[]) => {
  const handleData = (data: any) => console.log(data.toString().trim());
  let handleError = (data: Error) => console.error(data.toString().trim());

  return new Promise((resolve, reject) => {
    const ls = spawn(command, args, { cwd: process.cwd() });
    ls.stdout.on("data", handleData);
    ls.stderr.on("data", handleData);
    ls.on("error", handleError);
    ls.on("close", (code) => {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
};

deleteAsync("./build");
exec("yarn", ["rollup", "--config", "rollup.config.js"])
  .then(() => exec("yarn", ["tsc", "--build"]))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

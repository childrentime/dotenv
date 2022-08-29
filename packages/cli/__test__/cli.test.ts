import spawn from "cross-spawn";
import path from "path";
async function execDotenv(args: string[]) {
  const cp = spawn.sync("node", [
    "-r",
    require.resolve("esbuild-register"),
    path.resolve(__dirname, "../index.ts"),
    ...args,
  ]);

  return {
    stdout: cp.stdout.toString("utf-8"),
  };
}

describe("cli", () => {
  it("help", async () => {
    const { stdout } = await execDotenv(["--help"]);
    expect(stdout).toBe(
      "Usage: dotenv-cli [--help] [--debug] [-e <path>] [-v <name>=<value>] [-p <variable name>] [-- command]\n" +
        "  --help              print help\n" +
        "  --debug             output the files that would be processed but don't actually parse them or run the `command`\n" +
        "  -e <path>           parses the file <path> as a `.env` file and adds the variables to the environment\n" +
        "  -e <path>           multiple -e flags are allowed\n" +
        "  -v <name>=<value>   put variable <name> into environment using value <value>\n" +
        "  -v <name>=<value>   multiple -v flags are allowed\n" +
        "  -p <variable>       print value of <variable> to the console. If you specify this, you do not have to specify a `command`\n" +
        "  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags\n"
    );
  });

  it("-e", async () => {
    const { stdout } = await execDotenv([
      "-e",
      path.resolve(__dirname, "./env/.env"),
      "--",
      "bash",
      "-c",
      'echo "$BASIC"',
    ]);
    expect(stdout).toBe("basic\n");
  });

  it("-e mul", async () => {
    const { stdout } = await execDotenv([
      "-e",
      path.resolve(__dirname, "./env/.env"),
      "-e",
      path.resolve(__dirname, "./env/yml.env"),
      "--",
      "bash",
      "-c",
      'echo "$BASIC"',
    ]);
    expect(stdout).toBe("basic1\n");
  });

  it("-v", async () => {
    const { stdout } = await execDotenv([
      "-v",
      "KEY=VALUE",
      "--",
      "bash",
      "-c",
      'echo "$KEY"',
    ]);
    expect(stdout).toBe("VALUE\n");
  });

  it("-v mul", async () => {
    const { stdout } = await execDotenv([
      "-v",
      "KEY=VALUE",
      "-v",
      "KEY1=VALUE1",
      "--",
      "bash",
      "-c",
      'echo "$KEY" "$KEY1"',
    ]);
    expect(stdout).toBe("VALUE VALUE1\n");
  });

  it("-p", async () => {
    const { stdout } = await execDotenv([
      "-v",
      "KEY=VALUE",
      "-p",
      "KEY",
      "--",
      "bash",
      "-c",
      'echo "$KEY"',
    ]);
    expect(stdout).toBe("VALUE\nVALUE\n");
  });

  it("--debug", async () => {
    const { stdout } = await execDotenv([
      "-v",
      "KEY=VALUE",
      "-e",
      "./env/substitutions.env",
      "--debug",
    ]);
    expect(stdout).toBe(
      "[ './env/substitutions.env' ]\nMap(1) { 'KEY' => 'VALUE' }\n"
    );
  });
});

import minimist from "minimist";
import dotenv from "@jsdotenv/core";
import spawn from "cross-spawn";

function printHelp() {
  console.log(
    [
      "Usage: dotenv-cli [--help] [--debug] [-e <path>] [-v <name>=<value>] [-p <variable name>] [-- command]",
      "  --help              print help",
      "  --debug             output the files that would be processed but don't actually parse them or run the `command`",
      "  -e <path>           parses the file <path> as a `.env` file and adds the variables to the environment",
      "  -e <path>           multiple -e flags are allowed",
      "  -v <name>=<value>   put variable <name> into environment using value <value>",
      "  -v <name>=<value>   multiple -v flags are allowed",
      "  -p <variable>       print value of <variable> to the console. If you specify this, you do not have to specify a `command`",
      "  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags",
    ].join("\n")
  );
}

const argv = minimist(process.argv.slice(2));

if (argv.help) {
  printHelp();
  process.exit();
}

let paths: string[] = [];
if (argv.e) {
  if (typeof argv.e === "string") {
    paths.push(argv.e);
  } else {
    paths.push(...argv.e);
  }
}

function validateCmdVariable(param: string) {
  if (!param.match(/^\w+=[a-zA-Z0-9"=^!?%@_&\-/:;.]+$/)) {
    console.error(
      "Unexpected argument " +
        param +
        ". Expected variable in format variable=value"
    );
    process.exit(1);
  }

  return param;
}
const variables = [];
if (argv.v) {
  if (typeof argv.v === "string") {
    variables.push(validateCmdVariable(argv.v));
  } else {
    variables.push(...argv.v.map(validateCmdVariable));
  }
}

const parsedVariables = dotenv.parse(
  Buffer.from(variables.join("\n")).toString("utf-8")
);

if (argv.debug) {
  console.log(paths);
  console.log(parsedVariables);
  process.exit();
}

// exec after debug
if (paths.length) {
  dotenv.load(paths, { override: true });
}

for (const [key, value] of parsedVariables) {
  process.env[key] = value;
}

if (argv.p) {
  var value = process.env[argv.p];
  console.log(value != null ? value : "");
}

const command = argv._[0];
if (!command) {
  printHelp();
  process.exit(1);
}

spawn(command, argv._.slice(1), { stdio: "inherit" }).on("exit", function(
  exitCode,
  signal
) {
  if (exitCode != null) {
    process.exit(exitCode);
  } else {
    process.kill(process.pid, signal!);
  }
});

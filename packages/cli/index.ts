import spawn from "cross-spawn";
import chalk from "chalk";
import leven from "leven";
import dotenv from "@jsdotenv/core";

const { Command } = require("commander");
const envinfo = require("envinfo");

const program = new Command();
program
  .version(`@jsdotenv/cli ${require("./package.json").version}`)
  .usage("<command> [options]");

program
  .command("load")
  .description("load env by @jsdotenv/cli")
  .option(
    "-e --environment <envFilePath>",
    "parses the file <path> as a `.env` file and adds the variables to the environment"
  )
  .option("-e --environment <envFilePath>", "multiple -e flags are allowed")
  .action((options: any) => {
    console.log(options);
  });

program
  .command("info")
  .description("print debugging information about your environment")
  .action(() => {
    console.log(chalk.bold("\nEnvironment Info:"));
    envinfo
      .run(
        {
          System: ["OS", "CPU"],
          Binaries: ["Node", "Yarn", "npm"],
          Browsers: ["Chrome", "Edge", "Firefox", "Safari"],
          npmPackages: "/**/{typescript,@jsdotenv/*/}",
          npmGlobalPackages: ["@jsdotenv/cli"],
        },
        {
          showNotFound: true,
          duplicates: true,
          fullTree: true,
        }
      )
      .then(console.log);
  });

// output help information on unknown commands
program.on("command:*", ([cmd]: any) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
  process.exitCode = 1;
});

// add some useful info on help
program.on("--help", () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `dotenv <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

program.commands.forEach((c: any) => c.on("--help", () => console.log()));

program.parse(process.argv);

function suggestCommands(unknownCommand: any) {
  const availableCommands = program.commands.map((cmd: any) => cmd._name);

  let suggestion: any;

  availableCommands.forEach((cmd: any) => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || "", unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}

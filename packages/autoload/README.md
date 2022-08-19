# dotenv

A Javascript (nodejs) port of the Go [dotenv](https://github.com/joho/godotenv) project (which loads env vars from a .env file).

From the original Library:

Storing configuration in the environment is one of the tenets of a twelve-factor app. Anything that is likely to change between deployment environments–such as resource handles for databases or credentials for external services–should be extracted from the code into environment variables.

But it is not always practical to set environment variables on development machines or continuous integration servers where multiple projects are run. Dotenv load variables from a .env file into ENV when the environment is bootstrapped.

It can be used as a library (for loading in env for your own daemons etc.)

## Installation

```shell
npm i @jsdotenv/core
```

## Usage

Add your application configuration to your `.env` file in the root of your project:

```shell
S3_BUCKET=YOURS3BUCKET
SECRET_KEY=YOURSECRETKEYGOESHERE
```

Then in your Nodejs app you can do something like

```js
import dotenv from "@jsdotenv/core";

dotenv.load(__dirname + "/.env");
console.log(process.env["S3_BUCKET"]);
```

If you're even lazier than that, you can just take advantage of the autoload package which will read in `.env` on import

```js
import dotenvAuto from "@jsdotenv/autoload";
```

While `.env` in the project root is the default, you don't have to be constrained, both examples below are 100% legit

If you want to be really fancy with your env file you can do comments and exports (below is a valid env file)

```shell
# I am a comment and that is OK
SOME_VAR=someval
FOO=BAR # comments at line end are OK too
export BAR=BAZ
```

Or finally you can do YAML(ish) style

```yaml
FOO: bar
BAR: baz
```

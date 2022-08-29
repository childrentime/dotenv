# dotenv

Written in typescript, full testing.

It can loads environment variables from a `.env` file into [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) or parse `<key>=<value>` string

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

dotenv.load([__dirname + "/.env"]);
console.log(process.env["S3_BUCKET"]);
```

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

Multiple line is OK.

```shell
MULTI_DOUBLE_QUOTED="THIS
IS
A
MULTILINE
STRING"
```

Expand variables is OK.

```shellOPTION_A=1
OPTION_B=${OPTION_A}
OPTION_C=$OPTION_B
OPTION_D=${OPTION_A}${OPTION_B}
OPTION_E=${OPTION_NOT_DEFINED}
```

## Command Mode

```shell
npm i create-dotenv -g
```

### Usage

Execute commands using key-value pairs.

```shell
dotenv-cli -v KEY=VALUE -- bash -c 'echo "$BASIC"'
```

Execute commands using enviroment file.

```shell
dotenv-cli -e .env -- bash -c 'echo "$BASIC"'
```

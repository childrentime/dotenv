const core = require("./packages/core/rollup.config");
const cli = require("./packages/cli/rollup.config");

module.exports = function rollup() {
  return [...core(), ...cli()];
};

const core = require("@dotenv/core/rollup.config");
const autoload = require("./packages/autoload/rollup.config");

module.exports = function rollup() {
  return [core(), ...autoload()];
};

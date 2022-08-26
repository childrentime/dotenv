const core = require("./packages/core/rollup.config");

module.exports = function rollup() {
  return [...core()];
};

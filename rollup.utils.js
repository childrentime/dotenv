const path = require("path");

const outputDir = "build";

function getOutputDir(packageName) {
  return path.join(outputDir, "node_modules", packageName);
}

module.exports = {
  getOutputDir,
};

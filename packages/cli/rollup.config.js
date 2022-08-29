const path = require("path");
const babel = require("@rollup/plugin-babel").default;
const nodeResolve = require("@rollup/plugin-node-resolve").default;
const copy = require("rollup-plugin-copy");
const commonjs = require("@rollup/plugin-commonjs");

const { name: packageName } = require("./package.json");
const { getOutputDir } = require("../../rollup.utils");

module.exports = function rollup() {
  let sourceDir = "packages/cli";
  let outputDir = getOutputDir(packageName);
  let outputDist = outputDir;
  return [
    {
      input: `${sourceDir}/index.ts`,
      output: {
        dir: outputDist,
        format: "cjs",
        banner: "#!/usr/bin/env node\n",
      },
      plugins: [
        nodeResolve({
          extensions: [".ts"],
        }),
        babel({
          babelHelpers: "bundled",
          exclude: /node_modules/,
          extensions: [".ts"],
        }),
        commonjs(),
        copy({
          targets: [
            { src: `LICENSE.md`, dest: [outputDir, sourceDir] },
            { src: `${sourceDir}/package.json`, dest: [outputDir] },
            { src: `${sourceDir}/README.md`, dest: outputDir },
            { src: `${sourceDir}/CHANGELOG.md`, dest: outputDir },
          ],
        }),
      ],
    },
  ];
};

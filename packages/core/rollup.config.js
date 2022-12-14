const path = require("path");
const babel = require("@rollup/plugin-babel").default;
const nodeResolve = require("@rollup/plugin-node-resolve").default;
const copy = require("rollup-plugin-copy");
const commonjs = require("@rollup/plugin-commonjs");

const { name: packageName } = require("./package.json");
const { getOutputDir } = require("../../rollup.utils");

module.exports = function rollup() {
  let sourceDir = "packages/core";
  let outputDir = getOutputDir(packageName);
  let outputDist = path.join(outputDir, "dist");

  return [
    {
      input: `${sourceDir}/index.ts`,
      output: {
        dir: outputDist,
        format: "cjs",
        preserveModules: true,
        exports: "named",
      },
      plugins: [
        babel({
          babelHelpers: "bundled",
          exclude: /node_modules/,
          extensions: [".ts"],
        }),
        nodeResolve({ extensions: [".ts"] }),
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
    {
      input: `${sourceDir}/index.ts`,
      output: {
        format: "esm",
        dir: path.join(outputDist, "esm"),
      },
      plugins: [
        babel({
          babelHelpers: "bundled",
          exclude: /node_modules/,
          extensions: [".ts"],
        }),
        nodeResolve({ extensions: [".ts"] }),
        commonjs(),
      ],
    },
  ];
};

const path = require("path");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfing.path.json");

module.exports = {
  webpack: {
    alias: {
      "@stores": path.resolve(__dirname, "./src/app/stores"),
      "@components": path.resolve(__dirname, "./src/app/components"),
      "@contexts": path.resolve(__dirname, "./src/app/context"),
      "@scss": path.resolve(__dirname, "./src/scss"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@types": path.resolve(__dirname, "./src/types.ts"),
    },
  },
  jest: {
    configure: {
      preset: "ts-jest",
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>",
      }),
    },
  },
};

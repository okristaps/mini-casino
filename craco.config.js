const path = require("path");
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
};

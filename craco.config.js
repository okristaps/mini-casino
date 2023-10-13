const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@stores": path.resolve(__dirname, "./src/app/stores"),
      "@components": path.resolve(__dirname, "./src/app/components"),
      "@contexts": path.resolve(__dirname, "./src/app/context"),
    },
  },
};

const path = require("path");

module.exports = {
  // mode: "development",
  mode: "production",
  devtool: "cheap-module-source-map",
  entry: "./src/proxy.js",
  output: {
    path: path.resolve(__dirname, "production"),
    filename: "proxy.js",
  }
};

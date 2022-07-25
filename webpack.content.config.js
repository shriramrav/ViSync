const path = require("path");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/content.js",
  output: {
    path: path.resolve(__dirname, "production"),
    filename: "content.js",
  }
};

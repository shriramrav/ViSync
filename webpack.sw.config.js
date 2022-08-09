const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	// mode: "development",
  mode: "production",
	devtool: "cheap-module-source-map",
	entry: "./src/sw.js",
	output: {
		path: path.resolve(__dirname, "production"),
		filename: "sw.js",
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: "public",
					globOptions: {
						ignore: ["**/index.html"],
					},
				},
			],
		}),
	],
};

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(svg|ico)$/,
                type: "asset/resource",
                generator: {
                    filename: "./assets/icons/[hash][ext]",
                },
            },
            {
                test: /\.(webp|png)$/,
                type: "asset/resource",
                generator: {
                    filename: "./assets/images/[hash][ext]",
                },
            },
        ],
    },
};

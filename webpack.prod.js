const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin({ filename: "index.css" }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(svg|ico)$/,
                type: "asset/resource",
                generator: {
                    filename: "./assets/icons/[name].[hash][ext]",
                },
            },
            {
                test: /\.(webp|png)$/,
                type: "asset/resource",
                generator: {
                    filename: "./assets/images/[name].[hash][ext]",
                },
            },
        ],
    },
};

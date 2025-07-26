// webpack.config.json
const path = require("path");
let exclude = [path.resolve(__dirname, "public")];

module.exports = {
    entry: "./src/index.tsx",
    mode: "development",
    devtool: "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    compilerOptions: {
                        noEmit: false,
                    },
                },
                exclude,
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
                exclude,
            },
        ],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./public/js"),
    },
};

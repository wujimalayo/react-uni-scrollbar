const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "UniScrollbar",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.ts|tsx$/,
        exclude: /(node_modules|build)/,
        loader: "ts-loader",
      },
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|build)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  externals: {
    react: "react",
    "react-dom": "react-dom",
  },
};

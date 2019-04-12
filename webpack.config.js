module.exports = {
  entry: "./lib/main.js",
  output: {
    filename: "./js/bundle.js"
  },
  mode: "development",
  watch: true,
  resolve: {
    modules: ["node_modules"]
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/transform-runtime"]
          }
        }
      }
    ]
  }
};

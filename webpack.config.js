const path = require("path");

module.exports = {
  entry: {
    draft2026: './src/scripts/draft2026.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/js/special'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}

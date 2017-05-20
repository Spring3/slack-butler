const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './web/dynamic/react.js',
  output: {
    path: path.join(__dirname, 'web', 'static', 'js'),
    filename: 'bundle.min.js'
  },
  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [{
      test: path.join(__dirname, 'web', 'dynamic'),
      loader: 'babel-loader',
      query: {
        presets: ['es2016', 'es2017', 'react']
      }
    }, {
      test: /\.json?$/,
      exclude: /node_modules/,
      loader: 'json-loader'
    }]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    })
  ],
  watch: process.env.NODE_ENV !== 'production'
};

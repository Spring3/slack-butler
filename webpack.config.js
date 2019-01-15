const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const IsomorphicLoaderPlugin = require('isomorphic-loader/lib/webpack-plugin');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  target: 'web',
  entry: path.join(__dirname, './src/web/browser.js'),
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader!isomorphic-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.png']
  },
  plugins: [
    new IsomorphicLoaderPlugin()
  ]
};

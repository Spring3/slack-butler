const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');

module.exports = [{
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
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}];

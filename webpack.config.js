const isProduction = process.env.NODE_ENV === 'production';
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = [{
  mode: isProduction ? 'production' : 'development',
  target: 'node',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.join(__dirname, './dist/'),
    filename: 'server.js',
    publicPath: '/'
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: nodeExternals(),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      }
    ]
  }
}];
// }, {
//   mode: isProduction ? 'production' : 'development',
//   entry: path.join(__dirname, './src/web/browser.js'),
//   output: {
//     path: path.join(__dirname, './dist/assets'),
//     publicPath: '/',
//     filename: 'bundle.js'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         use: ['babel-loader']
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['.js', '.jsx']
//   }
// }];

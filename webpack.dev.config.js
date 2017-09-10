const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const PORT = process.env.PORT || 5000;

module.exports = {
  devtool: 'eval-source-map',
  target: 'web',
  externals: ['./node_modules/'],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.json']
  },
  entry: [
    'react-hot-loader/patch',
    `./node_modules/webpack-dev-server/client?http://localhost:${PORT}`,
    './node_modules/webpack/hot/only-dev-server',
    path.join(__dirname, './web/index.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: `http://localhost:${PORT}/dist/`
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: [path.resolve(__dirname, 'web')],
      loader: 'babel-loader'
    }, 
    {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader',
        options: {
          includePaths: ['./node_modules']
        }
      }]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('staging')
    })
  ]
};

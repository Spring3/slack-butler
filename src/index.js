require('@babel/polyfill');
require('@babel/register')({
  presets: [
    ['@babel/env', {
      modules: 'commonjs'
    }]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties"
  ]
});
const extendRequire = require('isomorphic-loader/lib/extend-require');

extendRequire({ startDelay: 0 }).then(() => require('./server.js')).catch(console.error);

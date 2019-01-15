require('@babel/polyfill');
require('@babel/register')({
  presets: [
    ['@babel/env', {
      modules: 'commonjs'
    }]
  ]
});
const extendRequire = require('isomorphic-loader/lib/extend-require');

extendRequire({ startDelay: 0 }).then(() => require('./server.js')).catch(console.error);

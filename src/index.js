require('@babel/polyfill');
require('@babel/register')({
  presets: [
    ['@babel/env', {
      modules: 'commonjs'
    }]
  ]
});
require('./server.js');

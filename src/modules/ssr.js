import React from 'react';
import { StaticRouter } from 'react-router-dom';
import App from '../web/App.jsx';
import { ServerStyleSheet } from 'styled-components'
const { renderToString } = require('react-dom/server');
const template = require('../web/template.js');
const { NODE_ENV } = require('./configuration.js');

module.exports = (currentLocation, context = {}) => {
  const initialState = {
    NODE_ENV,
    randomSeed: new Date().toISOString().substring(0, 10), // YYYY-MM-DD
  };
  const sheet = new ServerStyleSheet();
  const jsxString = renderToString(sheet.collectStyles(
    <StaticRouter location={currentLocation} context={context}>
      <App {...initialState} />
    </StaticRouter>
  ));
  const styleTags = sheet.getStyleTags();
  return template({
    jsxString,
    title: 'Starbot Dashboard',
    initialState: JSON.stringify(initialState),
    styles: styleTags
  });
}

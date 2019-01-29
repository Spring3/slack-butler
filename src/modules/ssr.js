import React from 'react';
import { StaticRouter, matchPath } from 'react-router-dom';
import App from '../web/App.jsx';
import { ServerStyleSheet } from 'styled-components'
const { renderToString } = require('react-dom/server');
const template = require('../web/template.js');
const { NODE_ENV } = require('./configuration.js');

module.exports = (req, res) => {
  const context = { user: req.user };
  const initialState = {
    NODE_ENV,
    isAuthenticated: !!context.user
  };
  if (req.url === '/') {
    initialState.randomSeed = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
  }

  const sheet = new ServerStyleSheet();
  const jsxString = renderToString(sheet.collectStyles(
    <StaticRouter location={req.url} context={context}>
      <App {...initialState} />
    </StaticRouter>
  ));
  const styleTags = sheet.getStyleTags();
  if (context.status === 404) {
    res.status(404);
  }
  if (context.url) {
    return res.redirect(301, context.url);
  }
  return template({
    jsxString,
    title: 'Starbot Dashboard',
    initialState: JSON.stringify(initialState),
    styles: styleTags
  });
}

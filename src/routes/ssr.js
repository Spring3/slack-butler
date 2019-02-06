import React from 'react';
import { StaticRouter, matchPath } from 'react-router-dom';
import App from '../web/App.jsx';
import { ServerStyleSheet } from 'styled-components'
const { renderToString } = require('react-dom/server');
const template = require('../web/template.js');
const { NODE_ENV } = require('../modules/configuration.js');
import ClientRoutes from '../web/views/routes';

module.exports = async (req, res, next) => {
  const context = { };
  const initialState = {
    NODE_ENV,
    user: req.user
  };
  if (req.url === '/') {
    initialState.randomSeed = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
  }

  const currentRoute = ClientRoutes.find(route => matchPath(req.url, route));
  if (!currentRoute) {
    return next();
  } else if (currentRoute && currentRoute.auth && !req.user) {
    return res.redirect('/');
  }

  res.setHeader('Content-Type', 'text/html');

  let data;
  if (currentRoute && currentRoute.loadData) {
    data = await currentRoute.loadData();
    context.data = data;
  }

  const sheet = new ServerStyleSheet();
  const jsxString = renderToString(sheet.collectStyles(
    <StaticRouter location={req.url} context={context}>
      <App {...initialState} />
    </StaticRouter>
  ));
  const styleTags = sheet.getStyleTags();

  const status = currentRoute.path === '/notfound' ? 404 : 200;
  return res.status(status).send(template({
    jsxString,
    title: 'Starbot Dashboard',
    initialState: JSON.stringify(initialState),
    styles: styleTags
  }));
}

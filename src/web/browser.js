import { render, hydrate } from 'react-dom';
import React from 'react';
import RootPage from './views/RootPage.jsx';

const { NODE_ENV } = window.__APP_INITIAL_STATE__;

const mountFn = NODE_ENV === 'production' ? hydrate : render;

mountFn(
  <RootPage {...window.__APP_INITIAL_STATE__} />,
  document.getElementById('root')
);

if (NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

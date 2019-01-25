import { render, hydrate } from 'react-dom';
import React from 'react';
import RootPage from './views/RootPage.jsx';

const initialState = window.__APP_INITIAL_STATE__ || {};
delete window.__APP_INITIAL_STATE__;

const { NODE_ENV } = initialState;

const mountFn = NODE_ENV === 'production' ? hydrate : render;

mountFn(
  <RootPage {...initialState} />,
  document.getElementById('root')
);

if (NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

import { render, hydrate } from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import configuration from './utils/configuration';
import App from './App.jsx';

const initialState = window.__APP_INITIAL_STATE__ || {};
delete window.__APP_INITIAL_STATE__;

const { NODE_ENV } = initialState;

configuration.init(initialState);

const mountFn = NODE_ENV === 'production' ? hydrate : render;

mountFn(
  <BrowserRouter>
    <App {...initialState} />
  </BrowserRouter>,
  document.getElementById('root')
);

if (NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

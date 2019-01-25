import { render, hydrate } from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const initialState = window.__APP_INITIAL_STATE__ || {};
delete window.__APP_INITIAL_STATE__;

const { NODE_ENV } = initialState;

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

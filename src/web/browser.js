import { render, hydrate } from 'react-dom';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import RootPage from './views/RootPage.jsx';

const initialState = window.__APP_INITIAL_STATE__ || {};
delete window.__APP_INITIAL_STATE__;

const { NODE_ENV } = initialState;
const theme = {
  normaltext: '#282828',
  specialtext: '#C0D6DF',
  success: 'mediumseagreen',
  main: '#29324f',
  mainlight: '#2d3b62',
  darkblue: '#212943',
  teal: '#788F99',
  cream: '#F1E4E8',
  beige: '#EAD9D2'
};

const mountFn = NODE_ENV === 'production' ? hydrate : render;

mountFn(
  <ThemeProvider theme={theme}>
    <RootPage {...initialState} />
  </ThemeProvider>,
  document.getElementById('root')
);

if (NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

import { hydrate } from 'react-dom';
import React from 'react';
import RootPage from './views/RootPage.jsx';

hydrate(
  <RootPage {...window.__APP_INITIAL_STATE__} />,
  document.getElementById('root')
);

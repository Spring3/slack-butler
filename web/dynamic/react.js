import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reducers from './redux/Reducers';
import ContextProvider from './redux/ContextProvider';
import Auth from './components/Auth';

ReactDOM.render(
  <ContextProvider store={createStore(reducers)}>
    <Auth />
  </ContextProvider>,
  document.getElementById('root')
);

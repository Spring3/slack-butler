import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reducers from './redux/Reducers';
import ContextProvider from './redux/ContextProvider';
import App from './components/App';

ReactDOM.render(
  <ContextProvider store={createStore(reducers)}>
    <App />
  </ContextProvider>,
  document.getElementById('root')
);

import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './utils/theme.js';

import RootPage from './views/RootPage.jsx';
import DashboardPage from './views/DashboardPage.jsx';
import NotFoundPage from './views/NotFound.jsx';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <div>
            <Link to="/">Landing</Link>
          </div>
          <div>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <Switch>
            <Route exact path="/" component={RootPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;

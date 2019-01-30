import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './utils/theme.js';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import RootPage from './views/RootPage.jsx';
import DashboardPage from './views/DashboardPage.jsx';
import NotFoundPage from './views/NotFound.jsx';

class App extends Component {
  componentWillMount() {
    console.log(this.props);
    const { isAuthenticated, history } = this.props;
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }

  render() {
    const { isAuthenticated, randomSeed } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" render={(props) => <RootPage randomSeed={randomSeed} />} />
          <AuthenticatedRoute isAuthenticated={isAuthenticated} path="/dashboard" component={DashboardPage} /> 
          <Route path='/notfound' component={NotFoundPage} />
        </Switch>
      </ThemeProvider>
    );
  }
}

export default withRouter(App);

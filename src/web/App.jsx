import React, { PureComponent } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './utils/theme.js';

import RootPage from './views/RootPage.jsx';
import DashboardPage from './views/DashboardPage.jsx';
import NotFoundPage from './views/NotFound.jsx';

class App extends PureComponent {
  componentWillMount() {
    const { isAuthenticated, history } = this.props;
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }

  render() {
    const { user, randomSeed } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" render={() => <RootPage randomSeed={randomSeed} />} />
          <Route path="/dashboard" render={() => <DashboardPage user={user} />} /> 
          <Route path='/notfound' component={NotFoundPage} />
        </Switch>
      </ThemeProvider>
    );
  }
}

export default withRouter(App);

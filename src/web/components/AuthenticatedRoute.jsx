import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = (props) => {
  const { isAuthenticated, staticContext = {} } = props;
  staticContext.url = isAuthenticated ? undefined : '/';
  return isAuthenticated
    ? (
      <Route {...props} />
    )
    : (
      <Redirect to="/" />
    );
};

AuthenticatedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

AuthenticatedRoute.defaultProps = {
  isAuthenticated: false
};

export default AuthenticatedRoute;

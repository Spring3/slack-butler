import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const AuthenticatedRoute = (props) => (
  <Route
    shouldRedirect={!props.isAuthenticated}
    redirectPath='/'
    {...props}
  />
);

AuthenticatedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

AuthenticatedRoute.defaultProps = {
  isAuthenticated: false
};

export default AuthenticatedRoute;

import React from 'react';

class ContextProvider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render() {
    return this.props.children;
  }
}

ContextProvider.childContextTypes = {
  store: React.PropTypes.object
};

module.exports = ContextProvider;

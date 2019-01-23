import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import SlackIcon from 'mdi-react/SlackIcon';

const Link = styled.a`
  text-decoration: none;
  border-radius: 10px;
  background: white;
  font-size: 20px;
  padding: 12px;
  font-weight: bold;
  margin: 10px 0px;
  display: inline-block;

  svg, span {
    vertical-align: middle;
  }

  ${
    ({ color }) => css`

      border: 2px solid ${color};
      color: ${color};

      svg, span {
        color: ${color};
      }
    `
  }
`;


class SlackBotButton extends PureComponent {

  render() {
    const { color } = this.props;
    return (
      <Link
        href='/auth/slack/bot'
        color={color}
      >
        <SlackIcon/>
        <span>&nbsp;Add to Slack</span>
      </Link>
    );
  }
}

SlackBotButton.propTypes = {  
  color: PropTypes.string.isRequired
};

class SlackAuthorizeButton extends PureComponent {
  render() {
    const { color } = this.props;
    return (
      <Link 
        href={`http://localhost:3000/auth/dashboard`}
        color={color}
      >
        <SlackIcon/>
        <span>&nbsp;Sign in with Slack</span>
      </Link>
    )
  }
}

SlackAuthorizeButton.propTypes = {
  color: PropTypes.string.isRequired
}

export {
  SlackAuthorizeButton,
  SlackBotButton
};

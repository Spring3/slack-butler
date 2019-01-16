import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import SlackIcon from 'mdi-react/SlackIcon';

const Link = styled.a`
  text-decoration: none;
  background: white;
  border: 2px solid green;
  border-radius: 10px;
  font-size: 20px;
  padding: 12px;
  font-weight: bold;
  margin: 10px 0px;
  display: inline-block;
  color: #green;

  svg, span {
    vertical-align: middle;
    color: green;
  }
`;


class SlackButton extends Component {
  render() {
    const { clientId, state } = this.props;
    const href = `https://slack.com/oauth/authorize?client_id=${clientId}&scope=bot,channels:history,groups:history,im:history,mpim:history&state=${state}`;
    return (
      <Link href={href}>
        <SlackIcon/>
        <span>&nbsp;Add to Slack</span>
      </Link>
    );
  }
}

SlackButton.propTypes = {  
  clientId: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired
};

SlackButton.defaultProps = {
  height: 40,
  width: 140
};

export default SlackButton;

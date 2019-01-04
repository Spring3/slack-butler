import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SlackButton extends Component {
  render() {
    const { height, width, clientId, state } = this.props;
    const href = `https://slack.com/oauth/authorize?client_id=${clientId}&scope=bot,channels:history,groups:history,im:history,mpim:history&state=${state}`;
    return (
      <a href={href}>
        <img
          alt="Add to Slack"
          height={height}
          width={width}
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
    );
  }
}

SlackButton.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  clientId: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired
};

SlackButton.defaultProps = {
  height: 40,
  width: 140
};

export default SlackButton;

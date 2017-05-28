import React from 'react';

export default class SlackButton extends React.Component {
  render() {
    const CLIENT_ID = CLIENT_ID || '';
    const url = `https://slack.com/oauth/authorize?scope=identity.basic&client_id=${CLIENT_ID}`;
    return (
      <a href={url}>
        <img src="https://api.slack.com/img/sign_in_with_slack.png" />
      </a>
    );
  }
}

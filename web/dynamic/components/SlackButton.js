import React from 'react';

export default class SlackButton extends React.Component {
  render() {
    const CLIENT_ID = process.env.CLIENT_ID || '';
    const url = `https://slack.com/oauth/authorize?scope=identity.basic&client_id=${CLIENT_ID}`;
    const styles = {
      backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png)',
      backgroundRepeat: 'no-repeat',
      height: '100px',
      width: '100px',
      backgroundSize: 'cover',
    };
    return (
      <a href={url} style={styles} className="logo"/>
    );
  }
}

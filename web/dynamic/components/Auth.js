import React from 'react';
import SlackButton from './SlackButton';

export default class Auth extends React.Component {
  render() {
    const styles = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    };

    const circleStyle = {
      border: '4px solid rgba(200, 200, 200, 0.5)',
      borderRadius: '50%',
      display: 'flex',
      padding: '50px'
    };
    return (
      <section style={styles} className="back">
        <div style={circleStyle}>
          <SlackButton />
        </div>
      </section>
    );
  }
}

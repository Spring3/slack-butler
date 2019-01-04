import React from 'react';
import SlackButton from '../components/SlackButton.jsx';

export default ({ state, clientId }) => (
  <div>
    <SlackButton
      state={state}
      clientId={clientId}
    />
  </div>
);

import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  background: #29324f;

  h1 {
    margin: 0;
  }
`;

export default () => (
  <Section>
    <h1>Dashboard</h1>
    <p>Use dashboard for a better view and management of saved resources</p>
    <ul>
      <li>Review and manage saved links for team or channel</li>
      <li>Review and manage personal favorites</li>
      <li>Review the most visited links (based on dashboard usage)</li>
      <li>And maybe even more</li>
    </ul>
  </Section>
)

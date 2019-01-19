import React from 'react';
import styled from 'styled-components';

import Section from './Section';
import Header from './SectionHeader';

const PaddedSection = styled(Section)`
  padding-top: 100px;
`;

const Container = styled.div`
`;

export default () => (
  <PaddedSection
  >
    <Container>
      <Header>About</Header>
      <p>A bot for easy and fun shared links management.</p>
      <ul>
        <li>Keep track of links that you and your teammates share</li>
        <li>Get access to your personal favorites</li>
        <li>Never loose your shared links</li>
        <li>Easily retrieve what you are interested in</li>
        <li>Get a random link to read and review</li>
        <li>See what's popular in your team or channel</li>
      </ul>
    </Container>
    <Container></Container>
  </PaddedSection>
)

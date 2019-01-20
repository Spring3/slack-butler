import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import SlackButton from './SlackButton.jsx';
import NightSkyMenu from './NightSkyMenu.jsx';
import logoImage from '../img/night_sky.png';

const TopSection = styled.section`
  height: 100vh;
  background: #29324f;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #2d3b62, #29324f);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #2d3b62, #29324f); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  position: relative;
`;

const Logo = styled.div`
  background-image: url(${logoImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 1100px) {
    background-size: cover;
  }

  @media (max-width: 550px) {
    background-size: 150%;
  }
`;

const Header = styled.h1`
  font-weight: 700;
  font-size: 40px;
  margin: 20px 0px;
`;

const CenteredContainer = styled.div`
  text-align: center;
  color: #282828;
  z-index: 10;

  @media (max-width: 550px) {
    font-size: 16px;

    h1 {
      font-size: 30px;
    }
  }
`;

const GettingStartedSection = ({ state, clientId }) => (
  <TopSection>
    <NightSkyMenu/>
    <Logo>
      <CenteredContainer>
        <Header>Getting Started</Header>
        <SlackButton
          state={state}
          clientId={clientId}
          height={50}
        />
        <p>Add the bot to your slack workspace.</p>
        <p>Then see the updates on the dashboard.</p>
      </CenteredContainer>
    </Logo>
  </TopSection>
);

GettingStartedSection.propTypes = {
  state: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  forwardedRef: PropTypes.object
};

export default GettingStartedSection;

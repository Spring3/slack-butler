import React from 'react';
import styled from 'styled-components';

import SlackImage from '../img/slack.png';
import SlackImageMobile from '../img/slack_mobile.png';
import iphone6 from '../img/iphone6.png';
import Typist from './Typist';
import Section from './Section';
import Header from './SectionHeader';

const SlackImageDiv = styled.div`
  position: relative;
  background-image: url(${SlackImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100%;
  min-height: 500px;
  height: 570px;

  @media (max-width: 800px) {
    background-image: url(${SlackImageMobile});
    background-position: center;
    background-size: 247px;
    left: -0.5px;
  }
`;

const IPhoneImageDiv = styled.div`
  background: none;
  flex-basis: 800px;
  @media (max-width: 800px) {
    background-image: url(${iphone6});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
`;

const AbsoluteItem = styled.div`
  position: absolute;
  color: black;
  top: 92.2%;
  left: calc(50% - 45px);
  font-size: 14px;

  @media (max-width: 800px) {
    top: 80.4%;
    left: calc(50% - 85px);
    font-weight: bold;
    font-size: 12px;
  }
`;

const TextContainer = styled.div`
  padding: 20px 0px;
  line-height: 1.5;
  color: #788F99;

  div {
    font-size: 20px;
  }

  @media (max-width: 800px) {
    div {
      font-size: 16px;
    }
  }

  @media (max-width: 550px) {
    div {
      font-size: 14px;
    }
  }
`;

const CommandsList = styled.ul`
  list-style-type: none;
  padding-left: 0px;

  li {
    margin-bottom: 7px;
  }

  li strong {
    background: #788F99;
    color: #212943;
    padding: 5px;
  }

  li span {
    background: #212943;
    color: #C0D6DF;
    padding: 5px;
  }

  li p {
    margin: 10px 0px 0px 0px;
    padding-left: 20px;
  }
`;

export default () => (
  <Section
    justify='center'
    align='center'
  >
    <TextContainer>
      <Header>Commands</Header>
      <div>
        <p>The bot supports the following list of commands:</p>
        <CommandsList>
          <li><strong>link</strong> - print out the link to the website</li>
          <li><strong>total</strong> - print out the total amount of saved links</li>
          <li><strong>scan</strong> - perform serach for links in the current channel</li>
          <li>
            <strong>print</strong> - print the requested amount of saved links<br/>
            <p>&nbsp;Example: <span>print top 10</span>, <span>print first 3</span></p>
          </li>
          <li>
            <strong>favorite</strong> - print the requested amount of favorite links<br/>
            <p>&nbsp;Example: <span>favorite top 10</span>, <span>favorite first 3</span></p>
          </li>
          <li>
            <strong>search</strong> - perform a search among the saved links by a given substring<br/>
            <p>&nbsp;&nbsp;Example: <span>search weather</span></p>
          </li>
          <li><strong>version</strong> - print the version of the bot</li>
          <li><strong>dashboard</strong> - print the link to the dashboard</li>
        </CommandsList>
      </div>
    </TextContainer>
    <IPhoneImageDiv>
      <SlackImageDiv>
        <AbsoluteItem>
          <Typist loop={true} speed={100} delay={800}>
            <span>scan</span>
            <span>total</span>
            <span>print top 10</span>
            <span>print first 10</span>
            <span>print last 10</span>
            <span>search github</span>
            <span>version</span>
            <span>dashboard</span>
            <span>favorite top 10</span>
            <span>favorite last 10</span>
          </Typist>
        </AbsoluteItem>
      </SlackImageDiv>
    </IPhoneImageDiv>
  </Section>
)

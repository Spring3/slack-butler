import React from 'react';
import styled, { css } from 'styled-components';
import SlackImage from '../img/slack.png';
import SlackImageMobile from '../img/slack_mobile.png';
import Typist from 'react-typist';

const Section = styled.section`
  background: #29324f;
`;

const Header = styled.h1`
  font-size: 30px;
`;

// background: #212943;

const Container = styled.div`
  width: 55%;
  margin: 0 auto;
  padding: 20px;
  color: white;

  h1 {
    margin-top: 0px;
  }

  @media (max-width: 1400px) {
    width: 70%;
  }

  @media (max-width: 1100px) {
    width: 90%;
  }

  @media (max-width: 860px) {
    width: 100%;
    padding: 0;
  }

  @media (max-width: 550px) {
    width: 100%;
  }
`;

const ImageDiv = styled.div`
  position: relative;
  background: url(${SlackImage});
  background-repeat: no-repeat;
  background-position: left;
  background-size: contain;
  width: 100%;
  min-height: 500px;
  height: 570px;

  @media (max-width: 800px) {
    background: url(${SlackImageMobile});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

const AbsoluteItem = styled.div`
  position: absolute;
  color: black;
  top: 92%;
  left: 340px;
  font-size: 14px;

  @media (max-width: 800px) {
    top: 89.7%;
    left: calc(50% - 110px);
    font-weight: bold;
  }
`;

export default () => (
  <Section>
    <Container>
      <Header>Commands</Header>
      <ImageDiv>
        <AbsoluteItem>
          <Typist>
            <span>scan</span>
            <Typist.Backspace count={4} delay={800} />
            <span>total</span>
            <Typist.Backspace count={5} delay={800} />
            <span>print top 10</span>
            <Typist.Backspace count={12} delay={400} />
            <span>print first 10</span>
            <Typist.Backspace count={14} delay={400} />
            <span>print last 10</span>
            <Typist.Backspace count={13} delay={400} />
            <span>search github</span>
            <Typist.Backspace count={13} delay={400} />
            <span>version</span>
            <Typist.Backspace count={7} delay={800} />
            <span>version</span>
            <Typist.Backspace count={7} delay={800} />
            <span>favorite top 10</span>
            <Typist.Backspace count={15} delay={400} />
            <span>favorite last 10</span>
            <Typist.Backspace count={16} delay={400} />
          </Typist>
        </AbsoluteItem>
      </ImageDiv>
      <p>The bot supports the following list of commands:</p>
      <code>
        <strong>link</strong> - print out the link to the website<br/>
        <strong>total</strong> - print out the total amount of saved links<br/>
        <strong>scan</strong> - perform serach for links in the current channel<br/>
        <strong>print</strong> - print the requested amount of saved links<br/>
        &nbsp;Example: `print top 10`, `print first 3`<br/>
        <strong>favorite</strong> - print the requested amount of favorite links<br/>
        &nbsp;Example: `favorite top 10`, `favorite first 3`<br/>
        <strong>search</strong> - perform a search among the saved links by a given substring<br/>
        &nbsp;Example: `search weather`<br/>
        <strong>version</strong> - print the version of the bot<br/>
        <strong>dashboard</strong> - print the link to the dashboard<br/>
      </code>
    </Container>
  </Section>
)

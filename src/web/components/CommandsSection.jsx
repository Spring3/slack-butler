import React from 'react';
import styled, { css } from 'styled-components';
import SlackImage from '../img/slack.png';
import SlackImageMobile from '../img/slack_mobile.png';
import Typing, { Cursor } from 'react-typing-animation';

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
  top: 92.2%;
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
          <Typing loop={true} speed={5}>
            <span>scan</span>
            <Typing.Backspace count={20} delay={300} />
            <span>total</span>
            <Typing.Backspace count={20} delay={300} />
            <span>print top 10</span>
            <Typing.Backspace count={20} delay={300} />
            <span>print first 10</span>
            <Typing.Backspace count={20} delay={300} />
            <span>print last 10</span>
            <Typing.Backspace count={20} delay={300} />
            <span>search github</span>
            <Typing.Backspace count={20} delay={300} />
            <span>version</span>
            <Typing.Backspace count={20} delay={300} />
            <span>dashboard</span>
            <Typing.Backspace count={20} delay={300} />
            <span>favorite top 10</span>
            <Typing.Backspace count={20} delay={300} />
            <span>favorite last 10</span>
            <Typing.Backspace count={20} delay={300} />
          </Typing>
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

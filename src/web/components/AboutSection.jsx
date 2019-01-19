import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import GithubCircleIcon from 'mdi-react/GithubCircleIcon';

import Section from './Section';
import Header from './SectionHeader';

const PaddedSection = styled(Section)`
  padding-top: 100px;
`;

const Container = styled.div`
  width: 60%;
  color: #788F99;
  
  a, a:visited {
    color: #EAD9D2;
  }

  svg {
    vertical-align: middle;
  }

  @media (max-width: 1000px) {
    width: 80%;
  }

  @media (max-width: 650px) {
    width: 100%;
    font-size: 15px;
  }
`;

class AboutSection extends PureComponent {
  render () {
    return (
      <PaddedSection
        direction='column'
        align='center'
        ref={this.props.forwardedRef}
      >
        <Container>
          <Header>About</Header>
          <p>
            This is a bot for easy and fun shared links management.<br/>
            From time to time, people on my team share links to useful resources and interesting materials.<br/>
            I wanted to have it organized so that every member of the team has access to it at any time and we both had the opportunity to get back to it during our free time.<br/>
            <br/>
            I decided not to register an official slack app for this bot to have each team, who decides to use this bot, to have ability to control the data on their own, set it up, configure the way they think is better for them.<br/>
            If you are facing any problems with the configuration, please refer to the README file and a list of solved issues <a href='https://github.com/Spring3/starbot' target='_blank' rel='nofollow noopener'>here</a>.<br/>
          </p>
          <ul>
            <li>Keep track of links that you and your teammates share</li>
            <li>Get access to your personal favorites</li>
            <li>Never loose your shared links</li>
            <li>Easily retrieve what you are interested in</li>
            <li>Get a random link to read and review</li>
            <li>See what's popular in your team or channel</li>
          </ul>
          <p>
            Created by <a target='_blank' rel='nofollow noopener' href='https://www.linkedin.com/in/dvasylenko/'>Daniyil Vasylenko</a><br/>
            Check out the source code on <a target='_blank' rel='nofollow noopener' href='https://github.com/Spring3/starbot'><GithubCircleIcon/></a>
          </p>
          <p>The image of a moon was <a target="_blank" rel="nofollow noopener" href='https://www.freepik.com/free-vector/night-background-with-moon-and-rain-of-meteorites_1112925.htm'>Designed by Freepik</a></p>
        </Container>
      </PaddedSection>
    );
  }
}

AboutSection.propTypes = {
  forwardedRef: PropTypes.object.isRequired
};

export default React.forwardRef((props, ref) => (
  <AboutSection {...props} forwardedRef={ref} />
));

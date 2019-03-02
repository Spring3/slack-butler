import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withTheme } from 'styled-components';
import { ChamellionNavbarComponent, NavbarItem } from '../components/Navbar';
import GettingStartedSection from '../components/GettingStarted';
import CommandsSection from '../components/CommandsSection';
import DashboardSection from '../components/DashboardSection';
import AboutSection from '../components/AboutSection';
import GithubCircleIcon from 'mdi-react/GithubCircleIcon';

class RootPage extends PureComponent {
  constructor(props) {
    super(props);
    this.sectionsRefs = {
      dashboard: React.createRef(),
      commands: React.createRef(),
      about: React.createRef()
    };
  }

  scroll = (sectionName) => {
    if (this.sectionsRefs[sectionName]) {
      window.scrollTo({
        top: this.sectionsRefs[sectionName].current.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  render () {
    const { theme, randomSeed } = this.props;
    return (
      <Fragment>
        <ChamellionNavbarComponent
          newBackground={theme.main}
          offsetElementRef={this.sectionsRefs.commands}
        >
          <NavbarItem target='_blank' rel='nofollow noopener' href='https://github.com/Spring3/starbot'><GithubCircleIcon size={30}/></NavbarItem>
          <NavbarItem onClick={this.scroll.bind(this, 'commands')}>Commands</NavbarItem>
          <NavbarItem onClick={this.scroll.bind(this, 'dashboard')}>Dashboard</NavbarItem>
          <NavbarItem onClick={this.scroll.bind(this, 'about')}>About</NavbarItem>
        </ChamellionNavbarComponent>
        <GettingStartedSection
          randomSeed={randomSeed}
        />
        <CommandsSection
          ref={this.sectionsRefs.commands}
        />
        <DashboardSection
          ref={this.sectionsRefs.dashboard}
        />
        <AboutSection
          ref={this.sectionsRefs.about}
        />
      </Fragment>
    )
  }
};

RootPage.propTypes = {
  randomSeed: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withTheme(RootPage);

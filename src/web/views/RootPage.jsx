import React, { Fragment, PureComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../utils/theme.js';

import Navbar from '../components/Navbar';
import GettingStartedSection from '../components/GettingStarted';
import CommandsSection from '../components/CommandsSection';
import DashboardSection from '../components/DashboardSection';
import AboutSection from '../components/AboutSection';

export default class RootPage extends PureComponent {
  constructor(props) {
    super(props);
    this.sectionsRefs = {
      dashboard: React.createRef(),
      commands: React.createRef(),
      about: React.createRef()
    };
  }

  render () {
    const { randomSeed } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <Navbar
            sectionsRefs={this.sectionsRefs}
          />
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
      </ThemeProvider>
    )
  }
};

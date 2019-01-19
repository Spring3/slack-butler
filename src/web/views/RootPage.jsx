import React, { Fragment, PureComponent } from 'react';

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
    }
  }

  render () {
    const { state, clientId } = this.props;
    return (
      <Fragment>
        <Navbar
          sectionsRefs={this.sectionsRefs}
        />
        <GettingStartedSection
          state={state}
          clientId={clientId}
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

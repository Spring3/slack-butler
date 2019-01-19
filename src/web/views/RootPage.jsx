import React, { Fragment, Component } from 'react';

import Navbar from '../components/Navbar';
import GettingStartedSection from '../components/GettingStarted';
import CommandsSection from '../components/CommandsSection';
import DashboardSection from '../components/DashboardSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

export default class RootPage extends Component {
  render () {
    const { state, clientId } = this.props;
    return (
      <Fragment>
        <Navbar/>
        <GettingStartedSection
          state = {state}
          clientId = {clientId}
        />
        <CommandsSection/>
        <DashboardSection/>
        <AboutSection/>
        <Footer/>
      </Fragment>
    )
  }
};

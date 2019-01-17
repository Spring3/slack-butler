import React, { Fragment, Component } from 'react';

import Navbar from '../components/Navbar';
import GettingStartedSection from '../components/GettingStarted';
import CommandsSection from '../components/CommandsSection';
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
        <section>
          <h1>Dashboard</h1>
          <p>Use dashboard for a better view and management of saved resources</p>
          <ul>
            <li>Review and manage saved links for team or channel</li>
            <li>Review and manage personal favorites</li>
            <li>Review the most visited links (based on dashboard usage)</li>
            <li>And maybe even more</li>
          </ul>
        </section>
        <section>
          <h1>About</h1>
          <p>A bot for easy and fun shared links management.</p>
          <ul>
            <li>Keep track of links that you and your teammates share</li>
            <li>Get access to your personal favorites</li>
            <li>Never loose your shared links</li>
            <li>Easily retrieve what you are interested in</li>
            <li>Get a random link to read and review</li>
            <li>See what's popular in your team or channel</li>
          </ul>
        </section>
        <Footer/>
      </Fragment>
    )
  }
};

import React, { Fragment, Component } from 'react';

import SlackButton from '../components/SlackButton.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default class RootPage extends Component {
  render () {
    const { state, clientId } = this.props;
    return (
      <Fragment>
        <Navbar/>
        <section>
          <h1>Getting Started</h1>
          <p>Click the button and add the bot to your slack workspace</p>
          <SlackButton
            state={state}
            clientId={clientId}
          />
          <p>Then see the updates on the dashboard.</p>
        </section>
        <section>
          <h1>Commands</h1>
          <p>The bot supports the following list of commands:</p>
          <ul>
          '[TODO] *link* - print out the link to the website.\n' +
      '*total* - print the amount of links saved.\n' +
      '*scan* - to scan this channel for links and attachments.\n' +
      '*print* - print the requested amount of links.\n' +
      'Example: `print top 10`, `print first 3`\n' +
      '*search* - perform a search by a given substring\n' +
      'Example: `search weather`\n' +
      '*version* - to print the version of the bot\n', channelId);
            <li><span>link</span> - print out the link to the given website hostname</li>
            <li><span>total</span> - print out the total amount of saved links</li>
            <li><span>scan</span> - perform search for links in the current channel</li>
            <li><span>print</span> - print the requested amount of saved links</li>
            <li><span>search</span> - perform a search among saved links by a given substring</li>
            <li><span>version</span> - print bot app version (package.json)</li>
          </ul>
        </section>
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

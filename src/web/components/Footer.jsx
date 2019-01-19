import React, { Component } from 'react';
import styled from 'styled-components';
import GithubCircleIcon from 'mdi-react/GithubCircleIcon';

class Footer extends Component {
  render() {
    return (
      <footer>
        <ul>
          <li><a href='https://github.com/Spring3/starbot' target='_blank' rel='nofollow noopener'><GithubCircleIcon/></a></li>
          <li>Created by <a target='_blank' rel='nofollow noopener' href='https://www.linkedin.com/in/dvasylenko/'>Daniyil Vasylenko</a></li>
          <li>Getting Started</li>
          <li>Commands</li>
          <li>Dashboard</li>
          <li>About</li>
        </ul>
      </footer>
    );
  }
}

export default Footer;

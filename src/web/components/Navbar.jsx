import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import GithubCircleIcon from 'mdi-react/GithubCircleIcon';

const Navbar = styled.nav`
  background: transparent;
  position: fixed;
  z-index: 3;
  width: 100%;
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
`;


const ListItem = styled.a`
  color: white;
  float: right;
  margin-right: 40px;
  padding: 20px 0px;
  &:hover {
    cursor: pointer;
  }
  &:visited {
    color: white;
  }

  svg {
    vertical-align: middle;
    position: relative;
    bottom: 4px;
  }

  @media (max-width: 550px) {
    margin-right: 30px;
  }
`;

class NavbarComponent extends PureComponent {
  scroll = (sectionName) => {
    console.log(this.props.sectionsRefs[sectionName]);
    if (this.props.sectionsRefs[sectionName]) {
      window.scrollTo({
        top: this.props.sectionsRefs[sectionName].current.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  scrollToCommands = () => this.scroll('commands')
  scrollToDashboard = () => this.scroll('dashboard')
  scrollToAbout = () => this.scroll('about')

  render() {
    return (
      <Navbar>
        <List>
          <ListItem target='_blank' rel='nofollow noopener' href='https://github.com/Spring3/starbot'><GithubCircleIcon size={30}/></ListItem>
          <ListItem onClick={this.scrollToCommands}>Commands</ListItem>
          <ListItem onClick={this.scrollToDashboard}>Dashboard</ListItem>
          <ListItem onClick={this.scrollToAbout}>About</ListItem>
        </List>
      </Navbar>
    );
  }
};

NavbarComponent.propTypes = {
  sectionsRefs: PropTypes.shape({
    dashboard: PropTypes.object.isRequired,
    commands: PropTypes.object.isRequired,
    about: PropTypes.object.isRequired
  }).isRequired
};

export default NavbarComponent;



import React from 'react';
import styled from 'styled-components';

const Navbar = styled.nav`
  background: #2d3b62;
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
`;

const ListItem = styled.li`
  color: white;
  float: right;
  margin-right: 40px;
  padding: 20px 0px;
  &:hover {
    cursor: pointer;
  }
`;

export default () => (
  <Navbar>
    <List>
      <ListItem>Get Started</ListItem>
      <ListItem>Commands</ListItem>
      <ListItem>Dashboard</ListItem>
      <ListItem>About</ListItem>
      <ListItem>Sign in</ListItem>
    </List>
  </Navbar>
);

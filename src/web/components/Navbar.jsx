import React from 'react';
import styled from 'styled-components';

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
      <ListItem>Commands</ListItem>
      <ListItem>Dashboard</ListItem>
      <ListItem>About</ListItem>
    </List>
  </Navbar>
);



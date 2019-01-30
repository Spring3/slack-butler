import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled, { withTheme, css } from 'styled-components';
import Navbar, { NavbarItem } from '../components/Navbar';


const ProfileTile = styled.div`
  ${
    ({ img }) => css`
      background-image: url(${img});
    `
  }
  background-size: contain;
  background-repeat: no-repeat;
  padding-left: 30px;
`;

class DashboardPage extends PureComponent {
  render() {
    const { theme, user } = this.props;
    console.log(user);
    const { name, avatar } = user;
    return (
      <Fragment>
        <Navbar background={theme.main}>
          <NavbarItem>
            <ProfileTile img={avatar}>{name}</ProfileTile>
          </NavbarItem>
          <NavbarItem>Log out</NavbarItem>
        </Navbar>

      </Fragment>
    );
  }
};

DashboardPage.propTypes = {
  theme: PropTypes.object.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    team: PropTypes.shape({
      id: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default withTheme(DashboardPage);

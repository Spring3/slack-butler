import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Navbar = styled.nav`
  position: fixed;
  z-index: 3;
  width: 100%;

  ${
    ({ background }) => css`
      background: ${background};
    `
  }
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
`;


const NavbarItem = styled.a`
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

const NavbarComponent = ({ background, children }) => (
  <Navbar background={background}>
    <List>
      { children }
    </List>
  </Navbar>
);

NavbarComponent.propTypes = {
  background: PropTypes.string,
  children: PropTypes.node
};

NavbarComponent.defaultProps = {
  background: 'transparent'
};

class ChamellionNavbarComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.defaultBackground = props.background;
    this.state = {
      background: props.background
    };
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  trackScrolling = () => {
    const { newBackground, offsetElementRef } = this.props;
    if (this.state.background === this.defaultBackground && window.scrollY >= offsetElementRef.current.offsetTop) {
      this.setState({ background: newBackground });
    } else if (this.state.background === newBackground && window.scrollY < offsetElementRef.current.offsetTop) {
      this.setState({ background: this.defaultBackground });
    }
  }

  render() {
    const { children } = this.props;
    return (
      <NavbarComponent background={this.state.background}>
        {children}
      </NavbarComponent>
    )
  }
}
  
ChamellionNavbarComponent.propTypes = {
  offsetElementRef: PropTypes.object.isRequired,
  background: PropTypes.string,
  newBackground: PropTypes.string
};

ChamellionNavbarComponent.defaultProps = {
  background: 'transparent'
};

export {
  NavbarItem,
  ChamellionNavbarComponent
};

export default NavbarComponent;



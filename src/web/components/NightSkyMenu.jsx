import React, { PureComponent } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import StarIcon from 'mdi-react/StarIcon';
import StarFourPointsIcon from 'mdi-react/StarFourPointsIcon';
import StarFourPointsOutlineIcon from 'mdi-react/StarFourPointsOutlineIcon';
import CircleSmallIcon from 'mdi-react/CircleSmallIcon';
import seedrandom from 'seedrandom';

const fadeAnimation = keyframes`
  0% {
    opacity: 0;
  }
  20%, 100% {
    opacity: 1;
  }
`;

const rotationAnimation = keyframes`
  from {
    transform: rotateZ(0deg);
  }

  to {
    transform: rotateZ(360deg);
  }
`;

const AbsoluteMenuItem = styled.div`
  position: absolute;
  ${props => css`
    top: ${props.y || 0}%;
    left: ${props.x || 0}%;
    transform: rotateZ(${props.rotation || 0}deg);
    animation: ${fadeAnimation} ${props.animationTime}s infinite;
  `}
  svg, span {
    vertical-align: middle;
  }

  span {
    color: white;
    border-bottom: 2px solid white;
    position: relative;
    font-size: 20px;
    bottom: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  div {
    text-align: center;
  }
`;

AbsoluteMenuItem.propTypes = {
  y: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  x: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  animationTime: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  adaptive: PropTypes.bool
};

const RotatingContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  ${props => css`
    animation: ${rotationAnimation} ${props.animationTime}s linear infinite;
  `}
`;

RotatingContainer.propTypes = {
  animationTime: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};

const MenuContainer = styled.div`
  position: absolute;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

class NightSky extends PureComponent {
  constructor (props) {
    super(props);
    this.rnd = seedrandom(props.randomSeed);
  }

  getRandomNumber = (min, max) => {
    return this.rnd() * (max - min) + min;
  }

  spawnParticle(component, amount) {
    return _.times(amount, (i) => {
      const x = this.getRandomNumber(-50, 101);
      const y = this.getRandomNumber(-50, 101);
      const size = this.getRandomNumber(10, 31);
      const rotation = this.getRandomNumber(0, 361);
      const animationDuration = this.getRandomNumber (5, 30);
      return (
        <AbsoluteMenuItem
          key = {i}
          x = {x}
          y = {y}
          rotation = {rotation}
          animationTime = {animationDuration}
        >
          {
            React.cloneElement(component, { size })
          }
        </AbsoluteMenuItem>
      );
    });
  }

  render() {
    return (
      <MenuContainer>
        <RotatingContainer animationTime={130}>
          {
            this.spawnParticle(<StarIcon color="white"/>, 25)
          }
        </RotatingContainer>
        <RotatingContainer animationTime={100}>
          {
            this.spawnParticle(<StarFourPointsIcon color="white"/>, 25)
          }
        </RotatingContainer>
        <RotatingContainer animationTime={80}>
          {
            this.spawnParticle(<StarFourPointsOutlineIcon color="white"/>, 25)
          }
        </RotatingContainer>
        <RotatingContainer animationTime={115}>
          {
            this.spawnParticle(<CircleSmallIcon color="white"/>, 25)
          }
        </RotatingContainer>
      </MenuContainer>
    );
  };
};

NightSky.propTypes = {
  randomSeed: PropTypes.string.isRequired
};

export default NightSky;

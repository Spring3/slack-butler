import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import StarIcon from 'mdi-react/StarIcon';
import StarFourPointsIcon from 'mdi-react/StarFourPointsIcon';
import StarFourPointsOutlineIcon from 'mdi-react/StarFourPointsOutlineIcon';
import CircleSmallIcon from 'mdi-react/CircleSmallIcon';

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

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

const Sky = ({ component, amount }) => {
  return _.times(amount, (i) => {
    const x = getRandomNumber(-50, 101);
    const y = getRandomNumber(-50, 101);
    const size = getRandomNumber(10, 31);
    const rotation = getRandomNumber(0, 361);
    const fadeAnimation = getRandomNumber (5, 30);
    return (
      <AbsoluteMenuItem
        key = {i}
        x = {x}
        y = {y}
        rotation = {rotation}
        animationTime = {fadeAnimation}
      >
        {
          React.cloneElement(component, { size })
        }
      </AbsoluteMenuItem>
    );
  });
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

export default () => (
  <MenuContainer>
    <RotatingContainer animationTime={130}>
      <Sky
        component={<StarIcon color="white"/>}
        amount={25}
      />
    </RotatingContainer>
    <RotatingContainer animationTime={100}>
      <Sky
        component={<StarFourPointsIcon color="white"/>}
        amount={25}
      />
    </RotatingContainer>
    <RotatingContainer animationTime={80}>
      <Sky
        component={<StarFourPointsOutlineIcon color="white"/>}
        amount={25}
      />
    </RotatingContainer>
    <RotatingContainer animationTime={115}>
      <Sky
        component={<CircleSmallIcon color="white"/>}
        amount={25}
      />
    </RotatingContainer>
  </MenuContainer>
);

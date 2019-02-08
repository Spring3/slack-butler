import React, { Fragment } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const highlightAnimation = keyframes`
  0% {
    background: #212943;
  }
  50% {
    background: #252D47;
  }
  100% {
    background: #212943;
  }
`;

const IndicatorComponent = styled.div`
  ${
    props => css`
      height: ${props.height};
      width: ${props.width};
      background: ${props.theme.darkblue}
    `
  }
  border-radius: 3px;
  margin: 10px;
  text-align: center;
	animation: ${highlightAnimation} 2s ease-in-out infinite;
`;

const LoadingIndicator = ({ active, children, height, width }) =>
  active
  ? (
    <IndicatorComponent height={height} width={width}/>
  )
  : (
    <Fragment>
    { children }
    </Fragment>
  );

LoadingIndicator.propTypes = {
  children: PropTypes.node,
  height: PropTypes.string,
  width: PropTypes.string,
  active: PropTypes.bool
};

LoadingIndicator.defaultProps = {
  height: '100%',
  width: 'auto',
  active: false
};

export default LoadingIndicator;

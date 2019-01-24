import styled, { withTheme, css } from 'styled-components';

export default withTheme(styled.h1`
  font-size: 40px;
  ${
    (props) => css`
      background: ${props.theme.darkblue};
    `
  }
  padding: 0px 20px;

  @media (max-width: 550px) {
    font-size: 30px;
  }
`);

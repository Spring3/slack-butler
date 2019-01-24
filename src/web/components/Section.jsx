import styled, { css, withTheme } from 'styled-components';
import PropTypes from 'prop-types';

const Section = styled.section`
  display: flex;
  flex-wrap: wrap;
  padding: 50px 20px;
  ${
  ({ direction, justify, align, theme }) => css`
    background: ${theme.main};
    justify-content: ${justify};
    align-items: ${align};
    flex-direction: ${direction};
  `}
`;

Section.propTypes = {
  direction: PropTypes.oneOf(['column', 'row']),
  justify: PropTypes.oneOf(['center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly']),
  align: PropTypes.oneOf(['center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly']),
};

Section.defaultProps = {
  direction: 'row',
  justify: 'flex-start',
  align: 'flex-start'
};

export default withTheme(Section);

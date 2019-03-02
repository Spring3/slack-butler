import React from 'react';
import PropTypes from 'prop-types';
import MagnifyIcon from 'mdi-react/MagnifyIcon';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 10px 24px 10px 10px;
  width: 100%;
  max-width: calc(100% - 34px);
  font-size: 14px;
  border: none;
  border-radius: 5px;
`;

const Div = styled.div`
  position: relative;
`;

const SearchInput = ({ name = 'search', placeholder = 'Search', onChange }) => (
  <Div>
    <StyledInput
      name={name}
      type="text"
      placeholder={placeholder}
      onChange={onChange}
    />
    <MagnifyIcon style={{
      position: 'absolute',
      verticalAlign: 'middle',
      top: '7px',
      right: '0px'
    }}/>
  </Div>
);

SearchInput.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default SearchInput;

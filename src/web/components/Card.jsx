import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Card = styled.div`
  background: white;
  border-top: 5px solid #F1E4E8;
  border-radius: 3px;
  min-width: 200px;
  max-width: 300px;
  width: 20%;
  padding: 20px;
  margin: 20px 10px 0px 10px;
  text-align: center;
  box-shadow: 0px 0px 20px #212943;
  color: #29324f;

  @media (max-width: 660px) {
    min-width: 0px;
    width: 30%;
    padding: 10px 20px;

    p {
      font-size: 15px;
    }
  }
`;

const IconWrapper = styled.div`
  padding: 20px 0px;
  color: #EAD9D2;

  @media (max-width: 660px) {
    padding: 0px;
  }
`;

const Header = styled.p`
  font-size: 20px;
  font-weight: 600;

  @media (max-width: 660px) {
    font-size: 15px;
  }
`;

const CardFactory = ({ header, children, content }) => (
  <Card>
    <IconWrapper>
      {children}
    </IconWrapper>
    <Header>{header}</Header>
    <p>{content}</p>
  </Card>
);

CardFactory.propTypes = {
  header: PropTypes.string,
  // it's gonna be the icon
  children: PropTypes.node,
  content: PropTypes.string
};

CardFactory.defaultProps = {
  header: '',
  content: ''
};

export default CardFactory;

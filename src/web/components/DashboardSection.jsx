import React from 'react';
import styled from 'styled-components';
import TreasureChestIcon from 'mdi-react/TreasureChestIcon';
import DiamondOutlineIcon from 'mdi-react/DiamondOutlineIcon';
import ChartBarIcon from 'mdi-react/ChartBarIcon';
import StarOutlineIcon from 'mdi-react/StarOutlineIcon';
import Header from './SectionHeader';

import Section from './Section';
import Card from './Card';

const MarginedSection = styled(Section)`
  padding-top: 100px;
`;

const BigText = styled(Header)`
  color: #EAD9D2;
  text-align: center;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 80%;

  @media (max-width: 1590px) {
    max-width: 100%;
  }
`;

export default () => (
  <MarginedSection
    justify='center'
    align='center'
    direction='column'
  >
    <BigText>Dashboard for a better resource management</BigText>
    <CardContainer>
      <Card
        header='Review your finds'
        content='Review and manage saved links in a team or channel'
      >
        <TreasureChestIcon size="80px"/>
      </Card>
      <Card
        header='Favorites'
        content='Review and manage personal favorites'
      >
        <DiamondOutlineIcon size="80px"/>
      </Card>
      <Card
        header='Usage charts'
        content='Review the most visited links (based on dashboard usage)'
      >
        <ChartBarIcon size="80px"/>
      </Card>
      <Card
        header='And maybe even more'
        content='Who knows what new stuff will be added in the future'
      >
        <StarOutlineIcon size="80px"/>
      </Card>
    </CardContainer>
  </MarginedSection>
)

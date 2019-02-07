import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'isomorphic-fetch';
import queryUtils from '../utils/query';
import configuration from '../utils/configuration';
import styled, { withTheme, css } from 'styled-components';
import Navbar, { NavbarItem } from '../components/Navbar';
import Section from '../components/Section';
import MagnifyIcon from 'mdi-react/MagnifyIcon';
import TuneIcon from 'mdi-react/TuneIcon';
import FormatLineSpacingIcon from 'mdi-react/FormatLineSpacingIcon';
import ViewGridIcon from 'mdi-react/ViewGridIcon';

const ProfileTile = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  padding-left: 30px;
  ${
    ({ img }) => css`
      background-image: url(${img});
    `
  }
`;

class DashboardPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filters: undefined,
      author: undefined,
      channel: undefined,
      favorite: false,
      batchSize: 10,
      data: []
    };
  }

  componentWillMount() {
    const queryParams = queryUtils.asString(_.omit(this.state, 'data'));
    console.log(queryParams);
    const { API } = configuration.config;
    console.log(`${API}/dashboard/links?${queryParams}`);
    fetch(`${API}/dashboard/links?${queryParams}`)
      .then(res => this.setState({ data: res.json() }))
      .then((data) => console.log(data));
  }

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
        <Section
          direction="column"
          align="center"
        >
          <div>
            <MagnifyIcon />
            <div>
              <span>
                <TuneIcon />
                Filters
              </span>
            </div>
          </div>
          <div>
            <div>
              <strong>Search Results (0)</strong>
              <FormatLineSpacingIcon />
              <ViewGridIcon />
              <select>
                <option>10 Per Pag</option>
              </select>
              <select>
                <option>Date Down</option>
              </select>
            </div>
            <div>
              <a hre="#">
                <img src="https://placeimg.com/250/150/tech" alt="preview" />
                <p>Link name</p>
                <div>
                  <span>Channel: tech-resources</span>
                  <span>Shared by: Daniel</span>
                  <span>Added at: DEC 12 2018</span>
                </div>
              </a>
              <a hre="#">
                <img src="https://placeimg.com/250/150/tech" alt="preview" />
                <p>Link name</p>
                <div>
                  <span>Channel: tech-resources</span>
                  <span>Shared by: Daniel</span>
                  <span>Added at: DEC 12 2018</span>
                </div>
              </a>
              <a hre="#">
                <img src="https://placeimg.com/250/150/tech" alt="preview" />
                <p>Link name</p>
                <div>
                  <span>Channel: tech-resources</span>
                  <span>Shared by: Daniel</span>
                  <span>Added at: DEC 12 2018</span>
                </div>
              </a>
              <a hre="#">
                <img src="https://placeimg.com/250/150/tech" alt="preview" />
                <p>Link name</p>
                <div>
                  <span>Channel: tech-resources</span>
                  <span>Shared by: Daniel</span>
                  <span>Added at: DEC 12 2018</span>
                </div>
              </a>
            </div>
          </div>
        </Section>
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

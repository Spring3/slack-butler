import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import loadData from '../utils/fetch';
import queryUtils from '../utils/query';
import configuration from '../utils/configuration';
import styled, { withTheme, css } from 'styled-components';
import Navbar, { NavbarItem } from '../components/Navbar';
import Section from '../components/Section';
import LinkCard from '../components/LinkCard';
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
    const initialData = _.get(props, 'staticContext.data', []);
    this.state = {
      filters: undefined,
      author: undefined,
      channel: undefined,
      favorite: false,
      batchSize: 10,
      data: typeof initialData === 'string' ? JSON.parse(initialData) : initialData
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (window.__FETCHED_DATA__) {
        this.setState({
          data: window.__FETCHED_DATA__
        });
        delete window.__FETCHED_DATA__;
      } else {
        const { HOST, PORT } = configuration.config;
        loadData({
          protocol: window.location.protocol,
          method: 'GET',
          host: HOST,
          port: PORT,
          query: queryUtils.asString(_.omit(this.state, 'data'))
        }).then((res) => this.setState({ data: res.json() }, () => console.log(this.state)));
      }
    }, 0);
  }

  render() {
    const { theme, user = {} } = this.props;
    const { name, avatar } = user;
    const { data } = this.state;
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
              {
                data.map(({ _id, href, author, channel, createdAt }, i) => (
                  <LinkCard
                    key={i}
                    href={href}
                    createdAt={createdAt}
                    authorName={author}
                    channelName={channel.name}
                  />
                ))
              }
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

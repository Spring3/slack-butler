import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from 'react-select';
import loadData from '../utils/fetch';
import queryUtils from '../utils/query';
import configuration from '../utils/configuration';
import styled, { withTheme, css } from 'styled-components';
import Navbar, { NavbarItem } from '../components/Navbar';
import LinkCard from '../components/LinkCard';
import SearchInput from '../components/SearchInput';

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

const Aside = styled.aside`
  min-width: 200px;
  width: 240px;
  padding: 20px 0px;
  background: white;
  border-radius: 5px;
  position: fixed;
`;

const Section = styled.section`
  padding: 20px 0px 0px 260px;
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    margin-top: 10px;
  }
`;

const Label = styled.label`
  margin: 0 5px;
`;

class DashboardPage extends PureComponent {
  constructor(props) {
    super(props);
    const initialData = _.get(props, 'staticContext.data', []);
    this.state = {
      search: undefined,
      filters: undefined,
      author: undefined,
      channel: undefined,
      favorite: false,
      batchSize: 10,
      data: typeof initialData === 'string' ? JSON.parse(initialData) : initialData
    };

    this.authors = [
      { name: 'author1', id: 1, amount: 10 },
      { name: 'author2', id: 2, amount: 2 },
      { name: 'author3', id: 3, amount: 3 },
      { name: 'author4', id: 4, amount: 5 }
    ];

    this.channels = [
      { name: 'channel1', id: 1, amount: 8 },
      { name: 'channel2', id: 2, amount: 6 },
      { name: 'channel3', id: 3, amount: 6 }
    ];
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
  
  searchChange = (e) => {
    this.setState({
      search: e.target.value
    });
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
          <NavbarItem href='/auth/logout'>Log out</NavbarItem>
        </Navbar>
        <div style={{ width: '60%', margin: '0 auto', 'padding-top': '60px' }}>
          <Aside>
            <h4>General</h4>
            <div>
              <input name="favorites" type="checkbox"></input>
              <Label htmlFor="favorites">Favorites</Label>
              <span>(4)</span>
            </div>
            <h4>Author</h4>
            <List>
              {
                this.authors.map(({ name, id, amount }) => (
                  <li key={id}>
                    <input name={id} type="checkbox"/>
                    <Label htmlFor={id}>{name}</Label>
                    <span>({amount})</span>
                  </li>
                ))
              }
            </List>
            <h4>Channel</h4>
            <List>
              {
                this.channels.map(({ name, id, amount }) => (
                  <li key={id}>
                    <input name={id} type="checkbox"/>
                    <Label htmlFor={id}>{name}</Label>
                    <span>({amount})</span>
                  </li>
                ))
              }
            </List>
          </Aside>
          <Section>
            <SearchInput
              onChange={this.searchChange}
            />
            <div>
              <Select
                options={[
                  { name: 'createdAt:-1', label: 'Newest fisrt' },
                  { name: 'createdAt:1', label: 'Oldest first' },
                  { name: 'href:1', label: 'A-Z' },
                  { name: 'href:-1', label: 'Z-A' }
                ]}
              />
            </div>
            <div>
              {
                data.map(({ href, author, channel, createdAt, ogp }, i) => (
                  <LinkCard
                    key={i}
                    href={href}
                    createdAt={createdAt}
                    author={author}
                    channel={channel}
                    ogp={ogp}
                  />
                ))
              }
            </div>
          </Section>
        </div>
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

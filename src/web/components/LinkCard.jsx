import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LinkCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: undefined,
      imageUrl: undefined,
      description: undefined,
      loading: false
    };
  }

  render() {
    const { href, ogp = {}, channel = {}, author = {}, createdAt } = this.props;
    const {
      ogSiteName,
      ogTitle,
      ogDescription,
      ogImage = {},
      ogUrl
    } = ogp;
    const ogImageUrl = ogImage.url;
    return (
      // Move to HOC
      <a href={ogUrl || href}>
        { ogImageUrl  && (<img src={ogImageUrl} alt="preview" /> ) }
        <p>{ogTitle}</p>
        <div>
          <span>Site Name: {ogSiteName}</span>
          <span>Channel: {channel.name}</span>
          <span>Description: {ogDescription}</span>
          <span>Shared by: {author.name}</span>
          <span>Added at: {createdAt}</span>
        </div>
      </a>
    );
  }
}

LinkCard.propTypes = {
  href: PropTypes.string.isRequired,
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  author:  PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  createdAt: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]).isRequired,
  ogp: PropTypes.shape({
    ogSiteName: PropTypes.string,
    ogTitle: PropTypes.string,
    ogDescription: PropTypes.string,
    ogImageUrl: PropTypes.string,
    ogUrl: PropTypes.string
  })
};

export default LinkCard;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const LinkCard = ({ href, imageUrl, title, channelName, authorName, createdAt }) => (
  <a href={href}>
    <img src={imageUrl} alt="preview" />
    <p>{title}</p>
    <div>
      <span>Channel: {channelName}</span>
      <span>Shared by: {authorName}</span>
      <span>Added at: {createdAt}</span>
    </div>
  </a>
);

LinkCard.propTypes = {
  href: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  createdAt: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]).isRequired
}

export default LinkCard;

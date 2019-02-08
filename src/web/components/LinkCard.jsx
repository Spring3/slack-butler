import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';

class LinkCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: undefined,
      imageUrl: undefined,
      description: undefined,
      loading: false
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
  }

  render() {
    const { href, imageUrl, title, channelName, authorName, createdAt } = this.props;
    const { loading } = this.state;
    return (
      // Move to HOC
      <Loading height="100px" active={loading}>
        <a href={href}>
          { imageUrl && (<img src={imageUrl} alt="preview" /> ) }
          <p>{title}</p>
          <div>
            <span>Channel: {channelName}</span>
            <span>Shared by: {authorName}</span>
            <span>Added at: {createdAt}</span>
          </div>
        </a>
      </Loading>
    );
  }
}

LinkCard.propTypes = {
  href: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
  authorName:  PropTypes.string.isRequired,
  createdAt: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]).isRequired
}

export default LinkCard;

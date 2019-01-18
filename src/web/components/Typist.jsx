import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const Mode = {
  WRITING: 1,
  REMOVING: 2
}

class Typist extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      mode: Mode.WRITING,
      textQueue: this.props.children.reduce((acc, child) => acc.concat(child.props.children), []),
      textIndex: 0
    };
  }

  componentWillMount = () => {
    this.initializeInterval();
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  initializeInterval = () => {
    this.interval = setInterval(this.nextLoop, this.props.speed);
  }

  nextLoop = () => {
    const { textIndex, textQueue, text, mode } = this.state;
    const fullText = textQueue[textIndex];
    const currentTextLength = text.length;
    switch (mode) {
      case Mode.REMOVING:
        if (currentTextLength > 0) {
          this.setState({
            text: text.substring(0, currentTextLength - 1)
          });
        } else {
          this.setState({
            mode: Mode.WRITING,
            textIndex: textQueue.length <= textIndex + 1 
              ? 0
              : textIndex + 1
          });
        }
      break;
      case Mode.WRITING:
      default:
        if (currentTextLength !== fullText.length) {
          this.setState({
            text: fullText.substring(0, currentTextLength + 1)
          })
        } else {
          clearInterval(this.interval);
          this.setState({
            mode: Mode.REMOVING
          }, () => setTimeout(this.initializeInterval, this.props.delay));
        }
        break;
    }
  }

  render() {
    return (
      <span>
        {this.state.text}
      </span>
    );
  }
}

Typist.propTypes = {
  loop: PropTypes.bool,
  delay: PropTypes.number,
  speed: PropTypes.number,
  children: PropTypes.node
};

Typist.defaultProps = {
  loop: false,
  delay: 800,
  speed: 100,
  children: []
};

export default Typist;

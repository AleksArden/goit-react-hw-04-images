import { Component } from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

export class Modal extends Component {
  static propTypes = {
    image: PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }
  handleKeydown = evt => {
    if (evt.code === 'Escape') {
      this.props.onClose();
    }
  };
  hanleClickBackdrop = evt => {
    if (evt.target === evt.currentTarget) {
      this.props.onClose();
    }
  };
  render() {
    const {
      image: { src, alt },
    } = this.props;
    return (
      <div className={css.backdrop} onClick={this.hanleClickBackdrop}>
        <div className={css.modal}>
          <img className={css.img} src={src} alt={alt} />
        </div>
      </div>
    );
  }
}


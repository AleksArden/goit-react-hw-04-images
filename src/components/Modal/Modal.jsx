/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

export const Modal = ({ image: { src, alt }, onClose }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleKeydown = evt => {
    if (evt.code === 'Escape') onClose();
  };
  const hanleClickBackdrop = evt => {
    if (evt.target === evt.currentTarget) onClose();
  };

  return (
    <div className={css.backdrop} onClick={hanleClickBackdrop}>
      <div className={css.modal}>
        <img className={css.img} src={src} alt={alt} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

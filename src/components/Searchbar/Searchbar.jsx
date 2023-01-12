import { useState } from 'react';
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';

import css from './Searchbar.module.css';

export const Searchbar = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    onSubmit(inputValue.trim());
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button className={css.button} type="submit">
          <BsSearch className={css.icon} />
        </button>
        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
          value={inputValue}
        />
      </form>
    </header>
  );
};
Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

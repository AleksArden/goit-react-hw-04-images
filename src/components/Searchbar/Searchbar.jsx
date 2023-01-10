import { Component } from 'react';
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';

import css from './Searchbar.module.css';

export class Searchbar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
  state = {
    inputValue: '',
  };
  handleChange = ({ target: { value } }) => {
    this.setState({ inputValue: value });
  };
  handleSubmit = evt => {
    evt.preventDefault();
    const { inputValue } = this.state;
    this.props.onSubmit(inputValue.trim());
  };
  render() {
    const { inputValue } = this.state;
    return (
      <header className={css.searchbar}>
        <form className={css.form} onSubmit={this.handleSubmit}>
          <button className={css.button} type="submit">
            <BsSearch className={css.icon} />
          </button>
          <input
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
            value={inputValue}
          />
        </form>
      </header>
    );
  }
}

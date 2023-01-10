import { Component } from 'react';
import Notiflix from 'notiflix';
import { getImages } from 'services/images.services';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

import css from './App.module.css';

Notiflix.Notify.init({
  width: '400px',
  fontSize: '20px',
  cssAnimationStyl: 'zoom',
  position: 'center-center',
});

export class App extends Component {
  state = {
    images: [],
    search: '',
    page: 1,
    status: 'idle',
    currentImage: null,
  };

  componentDidUpdate(_, prevState) {
    const { search, page, currentImage } = this.state;

    if (page > 1 && prevState.currentImage === currentImage) {
      this.onPageScrolling();
    }
    if (prevState.search !== search || prevState.page !== page) {
      if (this.state.search !== '') {
        this.fetchData(search, page);
      }
    }
  }

  handleClickButtonLoadMore = () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
  };

  handleSearch = search => {
    if (search === '') {
      this.setState({
        status: 'idle',
        images: [],
        page: 1,
        search: '',
      });
      Notiflix.Notify.info('Please, fill in the search field!');
      return;
    }
    this.setState({
      images: [],
      search,
      page: 1,
    });
  };

  fetchData = async (search = '', page = 1) => {
    this.setState({ status: 'loading' });
    try {
      const data = await getImages(search, page);
      this.onResolve(data);
    } catch (error) {
      console.log(error);
      this.setState({ status: 'error' });
    }
  };

  onResolve({ hits, total, totalHits }) {
    const newImages = hits.map(({ id, webformatURL, tags, largeImageURL }) => ({
      id,
      webformatURL,
      tags,
      largeImageURL,
    }));
    if (total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      this.setState({ status: 'idle' });
      return;
    }
    if (totalHits < this.state.page * 12) {
      this.setState(({ images }) => ({
        images: [...images, ...newImages],
        status: 'idle',
      }));
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        { position: 'center-bottom' }
      );
      return;
    }
    this.setState(({ images }) => ({
      images: [...images, ...newImages],
      status: 'success',
    }));
  }

  handleOpenModal = image => {
    this.setState({ currentImage: image });
  };

  handleCloseModal = () => {
    this.setState({ currentImage: null });
  };

  onPageScrolling = () => {
    const { height: cardHeight } = document
      .querySelector('#gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  };
  render() {
    const { images, status, currentImage } = this.state;

    currentImage
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');

    return (
      <div className={css.app}>
        <Searchbar onSubmit={this.handleSearch} />
        {status === 'error' && (
          <h2 style={{ display: 'flex', justifyContent: 'center' }}>ERROR</h2>
        )}
        {images.length > 0 && (
          <ImageGallery onOpenModal={this.handleOpenModal} images={images} />
        )}
        {images.length > 0 && status === 'success' && (
          <Button onClick={this.handleClickButtonLoadMore} />
        )}
        {status === 'loading' && <Loader />}
        {currentImage && (
          <Modal image={currentImage} onClose={this.handleCloseModal} />
        )}
      </div>
    );
  }
}

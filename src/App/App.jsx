import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { fetchImages } from 'services/images.services';
import { Searchbar } from '../components/Searchbar/Searchbar';
import { ImageGallery } from '../components/ImageGallery/ImageGallery';
import { Button } from '../components/Button/Button';
import { Loader } from '../components/Loader/Loader';
import { Modal } from '../components/Modal/Modal';

import css from './App.module.css';

Notiflix.Notify.init({
  width: '400px',
  fontSize: '20px',
  cssAnimationStyl: 'zoom',
  position: 'center-center',
});

export const App = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [currentImage, setCurrentImage] = useState(null);

  const handleSearch = search => {
    if (search === '') {
      Notiflix.Notify.info('Please, fill in the search field!');
    }
    setImages([]);
    setSearch(search);
    setPage(1);
  };

  useEffect(() => {
    const getImages = async (search = '', page = 1) => {
      setStatus('loading');
      try {
        const data = await fetchImages(search, page);
        onResolve(data);
      } catch (error) {
        console.log(error);
        setStatus('error');
      }
    };

    const onResolve = ({ hits, total, totalHits }) => {
      const newImages = hits.map(
        ({ id, webformatURL, tags, largeImageURL }) => ({
          id,
          webformatURL,
          tags,
          largeImageURL,
        })
      );
      if (total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        setStatus('idle');
        return;
      }
      if (totalHits < page * 12) {
        setImages(images => [...images, ...newImages]);
        setStatus('idle');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
          { position: 'center-bottom' }
        );
        return;
      }
      setImages(images => [...images, ...newImages]);
      setStatus('success');
    };

    if (search === '') return;
    getImages(search, page);
  }, [search, page]);

  const handleClickButtonLoadMore = () => {
    setPage(state => state + 1);
  };

  useEffect(() => {
    if (page > 1) onPageScrolling();
  }, [images, page]);

  const handleOpenModal = image => {
    setCurrentImage(image);
  };

  const handleCloseModal = () => {
    setCurrentImage(null);
  };

  const onPageScrolling = () => {
    const { height: cardHeight } = document
      .querySelector('#gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  };

  currentImage
    ? (document.body.style.overflow = 'hidden')
    : (document.body.style.overflow = 'auto');

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSearch} />
      {status === 'error' && (
        <h2 style={{ display: 'flex', justifyContent: 'center' }}>ERROR</h2>
      )}
      {images.length > 0 && (
        <ImageGallery onOpenModal={handleOpenModal} images={images} />
      )}
      {images.length > 0 && status === 'success' && (
        <Button onClick={handleClickButtonLoadMore} />
      )}
      {status === 'loading' && <Loader />}
      {currentImage && (
        <Modal image={currentImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

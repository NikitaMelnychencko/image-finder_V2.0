import { notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import murkupImages from '../views/layouts/gallery.hbs';
import InfiniteScroll from 'infinite-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '23933594-99c5d6abfa76120a4e36d3057';
let page = 1;
let currentValue = '';

const formImage = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery-item');
const loaderEllipsEl = document.querySelector('.loader-ellips');

let infScroll = new InfiniteScroll('.gallery-item', {
  path() {
    return (
      BASE_URL +
      `?image_type=photo&orientation=horizontal&q=${currentValue}&page=${page}&per_page=12&key=${API_KEY}`
    );
  },
  responseBody: 'json',
  history: false,
  status: '.scroll-status',
  checkLastPage: true,
});
infScroll.on('load', (response, path) => {
  renderImages(response);
});
let gallery = new SimpleLightbox('.gallery img', {});
gallery.refresh();

formImage.addEventListener('submit', e => {
  e.preventDefault();
  currentValue = e.currentTarget.elements[0].value;

  e.currentTarget.elements[0].value = '';
  if (currentValue.length > 0) {
    page = 1;
    infScroll.loadNextPage();
  }
});
function renderImages(valueArr) {
  if (valueArr.hits.length === 0) {
    loaderEllipsEl.classList.add('is-hiden');
    return noticeNoResults();
  }
  const renderImages = murkupImages(valueArr.hits);
  if (page === 1) {
    galleryEl.innerHTML = renderImages;
  } else {
    galleryEl.insertAdjacentHTML('beforeend', renderImages);
  }
  page = page + 1;
  scrollInto(valueArr.hits[0].id);
  loaderEllipsEl.classList.remove('is-hiden');
  gallery.refresh();
}
function scrollInto(elem) {
  const element = document.getElementById(`${elem}`);
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function noticeNoResults() {
  const myNotice = notice({
    title: 'Sory',
    text: `No results were found for your search.`,
  });
}

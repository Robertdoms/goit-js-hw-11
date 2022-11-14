import PhotosApiServices from './partials/PhotosApiServices';
import './sass/index.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { data } from 'infinite-scroll';
import debounce from 'lodash.debounce';

Notify.init({ position: 'center-top', distance: '60px' });

const DEBOUNCE_DELAY = 500;

// console.log(document.documentElement.scrollHeight);

window.addEventListener('scroll', debounce(scrollOptions, DEBOUNCE_DELAY));

function scrollOptions() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  //   console.log({ scrollTop, scrollHeight, clientHeight });

  if (clientHeight + scrollTop >= scrollHeight + 5) {
    // show the loading animation
    console.log('end of scroll');
    loadMore();
  }
}

window.removeEventListener('scroll', scrollOptions);

let timerId = null;
const photosApiServices = new PhotosApiServices();
// console.log(photosApiServices.page);

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  input: document.querySelector('input[name-searchQuery]'),
  btn: document.querySelector('.submit-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const loadAnimationAction = document.querySelector('.loader');
// console.log(loadAnimationAction);
// console.log(photosApiServices);
refs.form.addEventListener('submit', onBtnSubmit);

async function onBtnSubmit(e) {
  e.preventDefault();

  clearGallety();
  photosApiServices.query = e.currentTarget.elements.searchQuery.value;
  photosApiServices.resetPage();

  loadAnimationAction.classList.remove('is-hiden');
  const data = await photosApiServices.fetchPhotos();
  const markup = data.hits.map(item => itemMarkup(item)).join('');
  loadAnimationAction.classList.add('is-hiden');

  console.log(data);
  if (data.total === 0) {
    btnToTop.classList.add('is-hiden');
    btnToBot.classList.add('is-hiden');
    return Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (photosApiServices.query === '' || photosApiServices.query === ' ') {
    btnToTop.classList.add('is-hiden');
    btnToBot.classList.add('is-hiden');

    return Notify.warning('input field cannot be empty.');
  } else {
    renderItem(markup);

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    document;
  }
}

async function loadMore(e) {
  loadAnimationAction.classList.remove('is-hiden');
  const data = await PhotosApiServices.fetchPhotos();
  const markup = data.hits.map(item => itemMarkup(item)).join('');
  loadAnimationAction.classList.add('is-hiden');

  renderItem(markup);
  const totalPages = Math.ceil(data.totalHits / 40);
  if (photosApiServices.page > totalPages) {
    SimpleLightbox.refresh();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
}).refresh();

function renderItem(markup) {
  btnToTop.classList.remove('is-hiden');
  btnToBot.classList.remove('is-hiden');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();

  refs.gallery.addEventListener('click', lightbox);
}

function itemMarkup({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
        <div class="photo-card">
  <a class="card-link" href="${largeImageURL}"><img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
      `;
}
function clearGallety() {
  refs.gallery.innerHTML = '';
}

const btnToTop = document.querySelector('.top-btn');
const btnToBot = document.querySelector('.bot-btn');

btnToTop.addEventListener('click', onScrollUp);
btnToBot.addEventListener('click', onScrollDown);

function onScrollUp() {
  const photoCard = document.querySelector('.photo-card');
  const { height: cardHeight } = photoCard.getBoundingClientRect();
  if (!photoCard) {
    return;
  } else {
    window.scrollBy({
      top: -cardHeight * 3,
      behavior: 'smooth',
    });
  }
}

function onScrollDown() {
  const photoCard = document.querySelector('.photo-card');
  const { height: cardHeight } = photoCard.getBoundingClientRect();
  if (!photoCard) {
    return;
  } else {
    window.scrollBy({
      top: cardHeight * 3,
      behavior: 'smooth',
    });
  }
}

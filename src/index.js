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
// let infScroll = new InfiniteScroll(refs.gallery, {
//   // options
//   path: 'photosApiServices.page + 1',
//   append: '.post',
//   history: false,
//   scrollThreshold: 100,
// });
// console.log(infScroll);
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
}

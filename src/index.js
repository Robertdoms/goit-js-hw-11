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

  if (clientHeight + scrollTop >= scrollHeight - 5) {
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

  // console.log(data);
  if (data.total === 0) {
    btnToTop.classList.add('is-hiden');
    btnToBot.classList.add('is-hiden');
    // refs.loadMoreBtn.classList.add('is-hiden');
    return Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (photosApiServices.query === '' || photosApiServices.query === ' ') {
    btnToTop.classList.add('is-hiden');
    btnToBot.classList.add('is-hiden');
    // refs.loadMoreBtn.classList.add('is-hiden');
    return Notify.warning('input field cannot be empty.');
  } else {
    renderItem(markup);
    // loadAnimationAction.classList.add('is-hiden');
    // setTimeout(renderItem(markup), 2000);

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    document;
  }
  //   if else (page > totalHits) {
  //       Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
  //   }
}

// refs.loadMoreBtn.addEventListener('click', loadMore);

async function loadMore(e) {
  //   e.preventDefault();
  //   console.log(photosApiServices.page);
  loadAnimationAction.classList.remove('is-hiden');
  const data = await photosApiServices.fetchPhotos();
  const markup = data.hits.map(item => itemMarkup(item)).join('');
  loadAnimationAction.classList.add('is-hiden');

  renderItem(markup);
  const totalPages = Math.ceil(data.totalHits / 40);
  //   console.log(totalPages);
  //   console.log(data);
  if (photosApiServices.page > totalPages) {
    // refs.loadMoreBtn.classList.add('is-hiden');
    lightbox.refresh();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

// let infScroll = new InfiniteScroll(refs.gallery, {
//   // options
//   path: photosApiServices.page,
//   append: '.post',
//   history: false,
// });

// console.log(infScroll);

// function photoApiFetch() {}
// refs.gallery.addEventListener('beforeend', markup)
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
}).refresh();

function renderItem(markup) {
  btnToTop.classList.remove('is-hiden');
  btnToBot.classList.remove('is-hiden');

  //   loadAnimationAction.classList.remove('is-hiden');
  //   setTimeout(() => {
  //     loadAnimationAction.classList.add('is-hiden');
  //   }, 2000);
  //   refs.loadMoreBtn.classList.remove('is-hiden');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  //   loadAnimationAction.classList.add('is-hiden');
  lightbox.refresh();
  //   lightbox.refresh();

  refs.gallery.addEventListener('click', lightbox);
}
// largeImageURL
// webformatURL;
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
// loadAnimation();
// function loadAnimation() {

//   timerId = setTimeout(() => {
//     console.log('lets party started');
//     loadAnimationAction.classList.remove('.is-hiden');
//   }, 1000);
// }
// function checkScrollDirection(event) {
//   const { height: cardHeight } = document
//     .querySelector('.galllery')
//     .document.querySelector('.photo-card')
//     .getBoundingClientRect();
//   if (checkScrollDirectionIsUp(event)) {
//     window.scrollBy({
//       down: cardHeight * 2,
//       behavior: 'smooth',
//     });
//     console.log('UP');
//   } else {
//     window.scrollBy({
//       down: -cardHeight * 2,
//       behavior: 'smooth',
//     });
//   }
// }
// function checkScrollDirectionIsUp(event) {
//   if (event.wheelDelta) {
//     return event.wheelDelta > 0;
//   }
//   return event.deltaY < 0;
// }

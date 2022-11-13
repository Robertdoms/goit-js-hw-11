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

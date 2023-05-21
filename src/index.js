import { refs } from './scripts/refs.js';
import fetchImages from './scripts/fetchImages.js';
import { markupCreate, markupRender, scrollBy } from './scripts/markup.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let searchQuery = '';
const gallery = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onBtnClick);

async function onSubmitForm(e) {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value;
  page = 1;
  window.addEventListener('scroll', handleScroll);

  if (!refs.loadMoreBtn.classList.contains('hidden')) {
    loadBtnToggle();
  }
  refs.listEl.innerHTML = '';

  if (searchQuery === '') return Notify.info('Enter some query text');

  try {
    const response = await fetchImages(searchQuery, page);

    if (response.hits.length === 0) {
      refs.formEl.reset();
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (response.hits.length < 40) {
      refs.formEl.reset();
      loadBtnToggle();
    }

    const markup = await markupCreate(response.hits);

    markupRender(markup);
    Notify.success(`Hooray! We found ${response.totalHits} images.`);

    scrollBy();

    gallery.refresh();
    refs.formEl.reset();
    loadBtnToggle();
  } catch (error) {
    console.log(error);
  }
}

async function onBtnClick() {
  page += 1;
  const response = await fetchImages(searchQuery, page);
  if (response.hits.length < 40) {
    loadBtnToggle();
    window.removeEventListener("scroll", handleScroll);
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  const markup = await markupCreate(response.hits);

  markupRender(markup);
  gallery.refresh();
  // scrollBy();
}

function loadBtnToggle() {
  refs.loadMoreBtn.classList.toggle('hidden');
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onBtnClick();
  }
}

  

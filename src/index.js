import { refs } from './js/refs.js';
import fetchImages from './js/fetchImages.js';
import { markupCreate, markupRender, scrollBy } from './js/markup.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let searchQuery = '';
let totalImages = 0;
const gallery = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onBtnClick);

async function onSubmitForm(e) {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  clearInput();
  page = 1;
  totalImages = 0;
  // refs.arrowDivEl.removeAttribute('style');
  // window.addEventListener('scroll', handleScroll);
  refs.listEl.innerHTML = '';
  refs.arrowDivEl.removeAttribute('style');

  if (!refs.loadMoreBtn.classList.contains('hidden')) loadBtnToggle();

  if (searchQuery === '') {
    // if (!refs.loadMoreBtn.classList.contains('hidden')) loadBtnToggle();
    return Notify.info('Enter some query text');
  }

  refs.arrowDivEl.style.display = 'none';
  try {
    const response = await fetchImages(searchQuery, page);

    if (response.hits.length === 0) {
      refs.arrowDivEl.removeAttribute('style');
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (
      refs.loadMoreBtn.classList.contains('hidden') &&
      response.hits.length === 40
    )
      loadBtnToggle();

    const markup = await markupCreate(response.hits);

    markupRender(markup);
    Notify.success(`Hooray! We found ${response.totalHits} images.`);

    totalImages += response.hits.length;
    scrollBy();

    gallery.refresh();
    // clearInput();
    // loadBtnToggle();
  } catch (error) {
    console.log(error);
  }
}

async function onBtnClick() {
  page += 1;
  try {
    const response = await fetchImages(searchQuery, page);
    totalImages += response.hits.length;
    if (response.hits.length < 40 || totalImages >= response.totalHits) {
      loadBtnToggle();
      // window.removeEventListener("scroll", handleScroll);
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    const markup = await markupCreate(response.hits);

    markupRender(markup);

    scrollBy();
    gallery.refresh();
  } catch (error) {
    console.log(error);
  }
}

function loadBtnToggle() {
  refs.loadMoreBtn.classList.toggle('hidden');
}

function clearInput() {
  refs.formEl.reset();
}

// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     onBtnClick();
//   }
// }

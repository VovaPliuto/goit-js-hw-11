import { refs } from "./refs";

export function markupCreate(data) {
  return data.reduce(
    (
      markup,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads, previewURL }
    ) => {
      return (
        markup +
        `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`
      );
    },
    ''
  );
}

export function markupRender(markup) { 
  refs.listEl.insertAdjacentHTML("beforeend", markup);
}

export function scrollBy() { 
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
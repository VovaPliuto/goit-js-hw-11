import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36547568-478c5d8084c7a48dd3b1eaaca';

export default async function fetchImages(value, page) {
  const { data } = await axios.get(
    `${URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );

  return data;
}

import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {
  fetchCountries(evt.target.value)
    .then(res => {
      if (res.length >= 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (res.length >= 2 && res.length <= 10) {
        console.log(res);
        listEl.innerHTML = countriesListMarkup(res);
      }

      //   if (res.length === 1) {
      //   }
    })
    .catch(err => {
      console.log(err);
      return Notiflix.Notify.failure(
        'Oops, there is no country with that name'
      );
    });
}

function countriesListMarkup(arr) {
  return arr
    .map(({ name, flags }) => {
      return `<li class="country-elem">
      <img class="country-flag" src="${flags.svg}" alt="flag"</img>
        <p class="country-name">${name.official}</p>
      </li>`;
    })
    .join('');
}

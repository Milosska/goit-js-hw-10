import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {
  let value = evt.target.value.trim();

  if (!value) {
    listEl.innerHTML = '';
    return;
  }

  fetchCountries(value)
    .then(res => {
      if (res.length === 1) {
        listEl.innerHTML = countryCardMarkup(res);
        return;
      }

      if (res.length >= 2 && res.length <= 10) {
        listEl.innerHTML = countriesListMarkup(res);
        return;
      }

      if (res.length >= 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
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

function countryCardMarkup(arr) {
  return arr
    .map(({ name, flags, capital, population, languages }) => {
      let langs = Object.values(languages).join(', ');

      return `<li class="card-element">
        <div class="contry-thumb">
          <img class="country-flag" src="${flags.svg}" alt="flag"</img>
          <h2 class="country-header">${name.official}</h2>
        </div>
        <p class="country-capital"><span class="country-bold">Capital: </span>${capital}</p>
        <p class="country-population"><span class="country-bold">Population: </span>${population}</p>
        <p class="country-langs"><span class="country-bold">Languages: </span>${langs}</p>
      </li>`;
    })
    .join('');
}

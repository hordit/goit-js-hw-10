import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries }  from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    serchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
}
const { serchBox, countryList, countryInfo } = refs;

serchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
   const searchName = e.target.value.trim();

   if (searchName === '') {
    clearListItemMarkup();
    clearInfoItemMarkup();
   } else {
    fetchCountries(searchName)
      .then(data => {
        if (data.length > 10) {
           Notify.info('Too many matches found. Please enter a more specific name.');
           clearListItemMarkup();
           clearInfoItemMarkup();
        } else if (data.length >= 2 && data.length <= 10) {
           clearInfoItemMarkup();
           countryList.innerHTML = appendListItemMarkup(data);
        } else {
            clearListItemMarkup();
           countryInfo.innerHTML = appendInfoCardMarkup(data);
        }
      })
       .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
       })
    }
};

function appendInfoCardMarkup(data) {
    return data
       .map(({name, capital, population, flags, languages}) => 
         `<li class="country-info country-info__item ">
          <img class="country-info__flag" src="${flags.svg}" alt="Flag of ${name.official}">
          <h2 class="country-info__name">${name.common}</h2>
          </li>
          <li class="country-info__item"><span>Capital:</span> ${capital}</li>
          <li class="country-info__item"><span>Population:</span>${population}</li>
          <li class="country-info__item"><span>Languages:</span>${Object.values(languages).join(', ')}</li>`
        ).join('');
};

function appendListItemMarkup(data) {
   return data
      .map(({name, flags}) => 
        `<li class="country-list__item">
         <img class="country-list__flags" src="${flags.svg}"  alt="Flag of ${name.official}">
         <p class="country-list__name">${name.common}</p>
         </li>`
    ).join('');
};

function clearListItemMarkup() {
    countryList.innerHTML = '';
}

function clearInfoItemMarkup() {
    countryInfo.innerHTML = '';
}

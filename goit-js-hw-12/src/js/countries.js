'use strict';
import '../styles.css';
const debounce = require('lodash.debounce');
const { error } = require('@pnotify/core');
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries.js';
import countriesTpl from '../templates/countries.hbs';
import oneCountriesTpl from '../templates/oneCountry.hbs';

const refs = {
  input: document.querySelector('.input'),
  countriesList: document.querySelector('.countries-list'),
};

refs.input.addEventListener('input', debounce(countrySearch, 500));
function countrySearch(event) {
  event.preventDefault();
  clearCountriesList();
  const inputValue = event.target.value;

  fetchCountries(inputValue).then(data => {
    // console.log(data);
    if (data.length > 10) {
      error({
        text: 'Too many matches found. Please enter a more specific query!',
      });
    } else if (data.length === 1) {
      buildListMarkup(data, oneCountriesTpl);
    } else if (data.length > 1 || data.length <= 10) {
      buildListMarkup(data, countriesTpl);
    }
  });
}
function buildListMarkup(countryes, template) {
  const markup = countryes.map(country => template(country));
  refs.countriesList.insertAdjacentHTML('afterbegin', markup);
}
function clearCountriesList() {
  refs.countriesList.innerHTML = '';
}

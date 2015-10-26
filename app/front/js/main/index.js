'use strict';
import $ from 'jquery';
import Backbone from 'backbone';
import moment from 'moment';
import ReactDOM from 'react-dom';
import React from 'react';
import L from 'mapbox.js';
import YouboraMap from './YouboraMap.jsx';

Backbone.$ = $;

L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhbmNrZXJuZXdlaW4iLCJhIjoiYXJLM0dISSJ9.mod0ppb2kjzuMy8j1pl0Bw';
//L.mapbox.config.FORCE_HTTPS = true;
//L.mapbox.config.HTTPS_URL = 'https://api.tiles.mapbox.com/v4';

const TIME_FACTOR = 0.1;

let raw = window.raw = new Backbone.Collection();
raw.url = 'data.json';
raw.fetch();

let current = new Backbone.Collection();
//let cities = new Backbone.Collection();

raw.once('sync', () => {
  add(0);
});

let timer;

function add(i) {
  let model = raw.at(i);

  //Timer
  let previous = raw.at(i - 1);
  if (i === 0 || previous.get('data').start !== model.get('data').start) {
    let count = 1;
    let next = raw.at(i + count);
    while (next && next.get('data').start === model.get('data').start) {
      count++;
      next = raw.at(i + count);
    }
    timer = 60 * 1000 / count;
  }

  current.add(model);
  setTimeout(() => {
    add(i + 1);
  }, timer * TIME_FACTOR);
}

current.on('add', (model) => {
  const start = moment(model.get('data').start, 'MM/DD/YY H:mm');
  const end = moment(model.get('data').end, 'MM/DD/YY H:mm');
  const delta = end.diff(start);
  setTimeout(() => {
    current.remove(model)
  }, delta * TIME_FACTOR);
});

current.on('remove', function() {
  console.log('removed');
});

function getCityId(video) {
  return video.get('data').city + ', ' + video.get('data').country;
}

/*
current.on('add', function(video) {
  let id = getCityId(video);
  let city = cities.get(id);
  if (city) {
    city.set('nb_video', city.get('nb_video') + 1);
  } else {
    cities.add({
      id: id,
      nb_video: 1,
      geojson: video.get('geojson')
    });
  }
});

current.on('remove', function(video){
  let id = getCityId(video);
  let city = cities.get(id);
  if(city && city.get('nb_video') > 1){
    city.set('nb_video', city.get('nb_video') - 1);
  }else{
    cities.remove(city);
  }
});
*/


let map = L.map(document.getElementById('map'));
map.setView([0, 0], 2);

let element = React.createElement(YouboraMap, {
  collection: current,
  map: map
});
ReactDOM.render(element, document.getElementById('map-component'));

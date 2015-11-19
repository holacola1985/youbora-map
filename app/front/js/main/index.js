'use strict';
import $ from 'jquery';
import Backbone from 'backbone';
import ReactDOM from 'react-dom';
import React from 'react';
import L from 'mapbox.js';
import YouboraMap from './YouboraMap.jsx';
import config from '../../../../config/public.json';
import {ItemBackboneModel} from 'lightstream-backbone';
import {MapboxSocket} from 'lightstream-socket';

Backbone.$ = $;

L.mapbox.accessToken = 'pk.eyJ1IjoiZnJhbmNrZXJuZXdlaW4iLCJhIjoiYXJLM0dISSJ9.mod0ppb2kjzuMy8j1pl0Bw';
//L.mapbox.config.FORCE_HTTPS = true;
//L.mapbox.config.HTTPS_URL = 'https://api.tiles.mapbox.com/v4';

var Collection = Backbone.Collection.extend({
  model: ItemBackboneModel
});


(function(config) {

  var collection = new Collection();
  var options = {
    retry_interval: 5000
  };
  var socket = new MapboxSocket('ws://' +  config.hostname + '/socket/', 'view', options);

  let map = L.map('map');
  map.setView([0, 0], 2);

  let element = React.createElement(YouboraMap, {
    collection: collection,
    map: map
  });

  ReactDOM.render(element, document.getElementById('map-component'));

  socket.on('opened', function () {
    socket.attachMap(map);
  });

  socket.on('new_items', function (item) {
    if(item.data.ended){
      setTimeout(function(){
        collection.remove(collection.get(item.id));
      }, 5000);
    }
    collection.set([item], { remove:false });
  });

  socket.on('error', function (error) {
    console.log('error in socket', error);
  });

  socket.on('closed', function () {
    console.log('socket has been closed');
  });

  socket.connect();

})(config);



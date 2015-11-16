'use strict';
var _ = require('lodash');
var url = require('url');
var request = require('request');
var items = require('./data.json');
var config = require('./config');


var urlParam = {
  protocol: 'http',
  hostname: config.public.hostname,
  query: {
    api_key: config.api.key
  }
};

function getApiUrl(obj) {
  return url.format(_.extend(obj, urlParam));
}

console.log(getApiUrl({
  pathname: 'api/items/item'
}));

function send(item, cb) {
  request({
    method: 'POST',
    uri: getApiUrl({
      pathname: 'api/items/item'
    }),
    json: {
      item: item
    }
  }, cb);
}


function treatItem(i) {
  var item = items[i];
  if (!item) {
    return false;
  }
  var toSend = {
    data: {
      ended: false
    },
    id: new Date().getTime(),
    geojson: item.geojson
  };
  send(toSend, function(error) {
    if (error) {
      console.log(error);
    } else {
      setTimeout(function() {
        toSend.data.ended = true;
        toSend.data.quality = _.sample([1, 2, 3, 4]);
        send(toSend);
      }, Math.round(Math.random() * 60000) + 1000);
    }
  });
  return true;
}

function loop(i) {
  if (treatItem(i)) {
    setTimeout(function() {
      loop(i + 1);
    }, Math.round(1000 / 30 * Math.random()) + 4000);
  }
}

loop(0);

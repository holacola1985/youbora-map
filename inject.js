'use strict';

var _ = require('lodash');
var config = require('./config');
var url = require('url');
var request = require('request');
var items = require('./data.json');

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

var global_count;
iterateOverItems();

function iterateOverItems() {
  var count = 0;
  global_count++;
  items.forEach(function(item) {
    item = {
      data: item.data,
      geojson: item.geojson,
      id: item.id.split('-')[2] + global_count.toString()
    };
    setTimeout(function() {
      request({
        method: 'POST',
        uri: getApiUrl({
          pathname: 'api/items/view'
        }),
        json: {
          item: item
        }
      }, function(error) {
        if (error) {
          console.log('error for data id ' + item.id);
          console.log(error);
        }
      });
      count--;
      if (count === 0) {
        console.log('restart');
        iterateOverItems();
      }
    }, (count + 1) * 200);
    count++;
  });
}

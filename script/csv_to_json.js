var fs = require('fs');
var stream = require('stream');
var csv = require('csv-parser');
var JSONStream = require('JSONStream');

var src = fs.createReadStream('./data_lnglat.csv');
var dest = fs.createWriteStream('./public/data.json');

var csv_options = {
  raw: false, // do not decode to utf-8 strings 
  separator: ';', // specify optional cell separator 
  //escape: '"', // specify optional escape character 
  newline: '\n', // specify a newline character 
  strict: true
};

function parseNum(str) {
  return parseFloat(str.replace(',', '.'));
}

var format = new stream.Transform({
  objectMode: true
});

format._transform = function transform(data, encoding, cb) {
  var item = {
    data: {
      city: data.City,
      country: data.Country,
      start: data.Start,
      end: data.End,
      duration: data.Duration,
      hash: data.Hash,
      delay: parseNum(data.Delay),
      buffer: parseNum(data['Buffer Duration'])
    },
    id: data.Start.replace(' ', '-') + '-' + data.Hash,
    geojson: {
      type: 'Point',
      coordinates: [parseFloat(data.lat), parseFloat(data['lng\r'].replace('\r', ''))]
    }
  };
  this.push(item);
  cb();
};



src.pipe(csv(csv_options)).pipe(format).pipe(JSONStream.stringify()).pipe(dest);

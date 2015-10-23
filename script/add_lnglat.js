var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var geocoder = require('node-geocoder');

var service = geocoder('google', 'https', {
  apiKey: 'AIzaSyCskYZNERj5wMR_Fk40aYvLLRvjfzxBRCA'
});

var addLatLng = new stream.Transform({
  objectMode: true
});

var cache = {};

addLatLng._transform = function(data, encoding, cb) {
  if(!data[6] || data.length === 0){
    cb();
    return;
  }
  var address = data[6] + ', ' + data[5];

  if(cache[address]){
    data.push(cache[address][0]);  
    data.push(cache[address][1]);  
    this.push(data.join(';') + '\r\n');
    cb();
    return;
  }

  service.geocode(address, function(err, results) {
    if (err) {
      console.log(err);
      this.emit('error', err);
    } else {
      var res = results[0];
      if(res){
        cache[address] = [res.longitude, res.latitude];
        data.push(res.longitude);
        data.push(res.latitude);
        this.push(data.join(';') + '\r\n');
      }
      cb();
    }
  }.bind(this));
};

var src = fs.createReadStream('./raw_data.csv');
var dest = fs.createWriteStream('./data_lnglat.csv');
var rl = readline.createInterface({
  input: src
});

//addLatLng.pipe(process.stdout);
addLatLng.pipe(dest);

var n = 0;
rl.on('line', function(line) {
  if (n > 0 && n < 10000) {
    var data = line.split(';');
    addLatLng.write(data);
  }
  n++;
});

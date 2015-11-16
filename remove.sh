curl --verbose -X POST -H "Content-Type: application/json" -d '{
  "item": {
    "data": {
      "ended": true,
      "quality": 1
    },
    "id": "1234abc",
    "geojson": {
      "type": "Point",
      "coordinates": [-3.7049520, 40.430030]
    }
  }
}' "http://youbora.lightstream.io/api/items/view?api_key=90937d9a0854446385b813c6c1998748"

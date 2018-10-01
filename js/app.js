'use strict'

var map;

var magRange = [0, 40];
var quakesInCountry = '';

var filterForm = document.getElementById('filterForm');
filterForm.addEventListener('submit', changeMagFilter);

function changeMagFilter() {
  event.preventDefault();
  var magInput = document.getElementById('filterMagnitude');
  magRange[0] = parseInt(magInput.value, 10);
  console.log(magRange);
  initMap();
  window.eqfeed_callback;
}


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(2.8,-187.3),
    mapTypeId: 'terrain'
  });

  // Create a <script> tag and set the USGS URL as the source.
  //var script = document.createElement('script');
  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  //script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  //document.getElementsByTagName('head')[0].appendChild(script);

  console.log(map);

}

//sorts throught the string
window.eqfeed_callback = function(results) { 
  console.log(results);
  localStorage.setItem('mapQuakes', JSON.stringify(results));
  loadQuakes(results);
}

function loadQuakes (results) {
  var results = results;
  console.log("loaded quakes");
  for (var i = 0; i < results.features.length; i++) {
    var strInput=results.features[i].properties.place;
    if(filterMagnitude(results.features[i].properties.mag)) {
      var coords = results.features[i].geometry.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var marker = new google.maps.Marker({
          position: latLng,
          map: map,
      });
    }
    // console.log(results);
    //localStorage.setItem("earthquakeKey", JSON.stringify(results));
  }
}


function filterMagnitude(quakeMag) {
  var willShow = true;
  var quakeMag = quakeMag;
  if(magRange && (quakeMag < magRange[0] || quakeMag > magRange[1])) {
    willShow = false;
  }
  return willShow;
}

function filterCountry(country) {
  var willShow = true;
  var country = country;
  if (quakesInCountry && !quakesInCountry.toUpperCase() === country.toUpperCase()) {
    willShow = false;
  }
  return willShow;
}


'use strict'

var map;

var magRange = [0, 40];
var quakesInCountry = '';

var filterForm = document.getElementById('filterForm');
filterForm.addEventListener('submit', changeFilters);

function changeFilters() {
  event.preventDefault();
  var magInput = document.getElementById('filterMagnitude');
  magRange[0] = parseInt(magInput.value, 10);
  initMap();
  window.eqfeed_callback;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(2.8,-187.3),
    mapTypeId: 'terrain'
  });

  // map.data.setStyle(function(feature) {
  //   var magnitude = feature.getProperty('mag');
  //   console.log(feature);
  //   return {
  //     icon: getIcon(magnitude)
  //   };
  // });
}

// function getIcon(magnitude) {
//   var magnitude = magnitude;
//   return {
//     path: google.maps.SymbolPath.CIRCLE,
//     fillColor: 'red',
//     fillOpacity: .2,
//     scale: Math.pow(2, magnitude) / 2,
//     strokeColor: 'red',
//     strokeWeight: .5
//   };
// }

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
    if(filterMagnitude(results.features[i].properties.mag)) {
      var infowindow = new google.maps.InfoWindow({content: "hi"});
      var coords = results.features[i].geometry.coordinates;
      console.log(coords);
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var marker = new google.maps.Marker({
          position: {lat: coords[1], lng: coords[0]},
          map: map
      });
      console.log(marker.position);
      marker.addListener('click', function(){
          infowindow.open(map, this);
        });
    }
  
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


'use strict';

function addElement(element, content, parent) {
  var newElement = document.createElement(element);
  var newContent = document.createTextNode(content);
  newElement.appendChild(newContent);
  parent.appendChild(newElement);
  return newElement;
}

var quakeInfo = document.getElementById('quakeData');
var quakes = localStorage.getItem('mapQuakes');
var earthquakeInfo = JSON.parse(quakes);


var map;

var magRange = [0, 40];
var quakesInCountry = '';

var filterForm = document.getElementById('filterForm');
filterForm.addEventListener('submit', changeFilters);

function changeFilters() {
  event.preventDefault();
  var magInput = document.getElementById('filterMagnitude');
  magRange[0] = parseInt(magInput.value, 10);
  console.log(magRange);
  initMap();
  loadQuakes(JSON.parse(localStorage.getItem('mapQuakes')));
}

function initMap() {
  document.getElementById('map').innerHTML = '';
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(2.8,-187.3),
    mapTypeId: 'terrain'
  }); 
}


window.eqfeed_callback = function(results) { 
  localStorage.setItem('mapQuakes', JSON.stringify(results));
  loadQuakes(JSON.parse(localStorage.getItem('mapQuakes')));
};

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
}



function loadQuakes (results) {
  //var results = results;
  for (var i = 0; i < results.features.length; i++) {
    if(filterMagnitude(results.features[i].properties.mag)) {
      var coords = results.features[i].geometry.coordinates;

      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var marker = new google.maps.Marker({
        position: {lat: coords[1], lng: coords[0]},
        map: map,
        icon: getIcon(results.features[i].properties.mag)
      });
      marker.informationIndex = i;
      marker.addListener('click', function(e) {
        quakeInfo.innerHTML = '';
        var eqGeo = earthquakeInfo.features[this.informationIndex].geometry;
        var eqProp = earthquakeInfo.features[this.informationIndex].properties;
        console.log('eq: ' + eqGeo.coordinates);
        addElement('li', "Coodinate Location: "+ eqGeo.coordinates, quakeInfo);
        addElement('li', "Magnitude: " + eqProp.mag, quakeInfo);
        addElement('li', "Place: "+ eqProp.place, quakeInfo);
        //console.log(earthquakeInfo.features[this.informationIndex]);
      });
    }
  }
}


// marker.addListener('click', function(){
//     infowindow.setContent(this.properties.mag);
//     infowindow.open(map, this);
// });

function getIcon(magnitude) {
  var magnitude = magnitude;
  var redness = 185 + 14 * magnitude;
  var opacity = 1 / magnitude;
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'rgb(' + redness + ', 70, 0)',
    fillOpacity: opacity,
    scale: Math.pow(2, magnitude) / 3,
    strokeColor: 'red',
    strokeWeight: .5
  };
}

// Returns true if magnitude filter is not set, or if marker's magnitude falls within 
function filterMagnitude(quakeMag) {
  var willShow = true;
  var quakeMag = quakeMag;
  if(quakeMag < magRange[0] || quakeMag > magRange[1]) {
    console.log('feature excluded');
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

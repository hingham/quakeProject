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
var searchLocation;
var searchRadius;

var filterForm = document.getElementById('filterForm');
filterForm.addEventListener('submit', changeFilters);

function changeFilters() {
  event.preventDefault();
  var magInput = document.getElementById('filterMagnitude');
  var longInput = document.getElementById('filterLongitude');
  var latInput = document.getElementById('filterLatitude');
  var radInput = document.getElementById('filterRadius');

  if (magInput.value) {
    magRange[0] = parseInt(magInput.value, 10);
  }

  if (longInput.value && latInput.value && radInput.value) {
    searchLocation = new google.maps.LatLng(latInput.value, longInput.value);
    searchRadius = radInput.value;
  } else if (longInput.value || latInput.value || radInput.value ) {
    console.log('bad input');
  }
  
  console.log(magRange);
  initMap();
  loadQuakes(JSON.parse(localStorage.getItem('mapQuakes')));
}

window.eqfeed_callback = function(results) { 
  console.log('entered eqfeed_callback');
  if (!localStorage.getItem('mapQuakes')) {
    console.log('no stored data');
    localStorage.setItem('mapQuakes', JSON.stringify(results));
  }
  
  initMap();
  loadQuakes(JSON.parse(localStorage.getItem('mapQuakes')));
}

function initMap() {
  document.getElementById('map').innerHTML = '';
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: new google.maps.LatLng(47.6062095,-122.3320708),
    mapTypeId: 'terrain'
  }); 
}



function loadQuakes(results) {
  var results = results;
  console.log("loaded quakes");
  
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    if(filterMagnitude(results.features[i].properties.mag) && filterLocation(coords)) {
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
      marker.addListener('click', getInfoPane);
    }
  }
}


// Returns true if magnitude filter is not set, or if marker's magnitude falls within 
function filterMagnitude(quakeMag) {
  var willShow = true;
  var quakeMag = quakeMag;
  if(quakeMag < magRange[0] || quakeMag > magRange[1]) {
    console.log('feature excluded by mag');
    willShow = false;
  } else {
    console.log('feature loaded');
  }
  return willShow;
}

function filterLocation(position) {
  var willShow = true;
  var locOfMarker = new google.maps.LatLng(position[1], position[0]);
  if (searchLocation) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(locOfMarker, searchLocation) / 1000;
    if (distance > searchRadius) {
      console.log('feature excluded by distance');
      willShow = false;
    } else {
      console.log('feature loaded');
    }
  }
  return willShow;
}

function getIcon(magnitude) {
  var magnitude = magnitude;
  var redness = 143 + (14 * magnitude);
  var yellowness = 128 - (16 * magnitude);
  var iconColor = 'rgb(' + redness + ', ' + yellowness + ', 0)';
  var opacity = 0.05 * magnitude;
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: iconColor,
    fillOpacity: opacity,
    scale: Math.pow(1.8, (magnitude - 1)) + .5,
    strokeColor: iconColor,
    strokeWeight: .5
  };
}


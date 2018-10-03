'use strict';


function stringQuakeData(n){
  var latitude = JSON.stringify(earthquakeInfo.features[n].geometry.coordinates[0]);
  var longitude = JSON.stringify(earthquakeInfo.features[n].geometry.coordinates[1]);
  var theMagnitude = JSON.stringify(earthquakeInfo.features[n].properties.mag);
  var place = earthquakeInfo.features[n].properties.place;

  return 'EARTHQUAKE DATA   ' + '<div> Location: ' + place + '</div>' + '<div> Magnitude: ' + theMagnitude +
  '</div>' + 'GPS Coordinates: ' + '</div>' + '(' + latitude + ', ' + longitude + ')';
}

var body =document.getElementById('body');
var triggerShake = document.getElementById('shake');
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
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: new google.maps.LatLng(47.6062095,-122.3320708),
    mapTypeId: 'terrain'
  });
}



function loadQuakes(results) {
  console.log('loaded quakes');
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
      });
     
      var infowindow = new google.maps.InfoWindow({
        maxWidth: 250
      });
      marker.addListener('click', function() {
      
        infowindow.setContent(stringQuakeData(this.informationIndex));
        infowindow.open(map, this);

      });

      marker.addListener('click', function() {
        map.setZoom(5);
        map.setCenter(this.getPosition());
      });
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



function handleClick(event){
  event.preventDefault();
  body.setAttribute('class', 'shake');
}


triggerShake.addEventListener('click', handleClick);

handleClick();

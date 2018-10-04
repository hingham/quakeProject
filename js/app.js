'use strict';


function stringQuakeData(n){
  var latitude = JSON.stringify(earthquakeInfo.features[n].geometry.coordinates[0]);
  var longitude = JSON.stringify(earthquakeInfo.features[n].geometry.coordinates[1]);
  var theMagnitude = JSON.stringify(earthquakeInfo.features[n].properties.mag);
  var place = earthquakeInfo.features[n].properties.place;

  return 'EARTHQUAKE DATA   ' + '<div> Location: ' + place + '</div>' + '<div> Magnitude: ' + theMagnitude +
  '</div>' + 'GPS Coordinates: ' + '</div>' + '(' + latitude + ', ' + longitude + ')';
}


var body = document.getElementById('body');
var triggerShake = document.getElementById('shake');
var quakeInfo = document.getElementById('quakeData');
var quakes = localStorage.getItem('mapQuakes');
var earthquakeInfo = JSON.parse(quakes);

var map;
var geocoder;
var gMarkers = [];

var magRange = [0, 40];
var searchLocation;
var searchRadius;

var filterForm = document.getElementById('filterForm');
filterForm.addEventListener('submit', changeFilters);


function locTypeCheck() {
  var filtLat = document.getElementById('filterLatitude');
  var filtLng = document.getElementById('filterLongitude');
  var filtAddr = document.getElementById('filterAddress');
  var filtRad = document.getElementById('filterRadius');
  if (document.getElementById("selectAddress").checked) {
    filtLat.style.display = "none";
    filtLng.style.display = "none";
    filtAddr.style.display="block";
    filtRad.style.display = "block";
    filtLat.value = filtLat.defaultValue;
    filtLng.value = filtLng.defaultValue;
  } else if (document.getElementById("selectLatLng").checked) {
    filtLat.style.display = "block";
    filtLng.style.display = "block";
    filtAddr.style.display="none";
    filtRad.style.display = "block";
    filtAddr.value = filtAddr.defaultValue;
  }
}

function changeFilters() {
  event.preventDefault();
  var magInput = document.getElementById('filterMagnitude').value;
  var longInput = document.getElementById('filterLongitude').value;
  var latInput = document.getElementById('filterLatitude').value;
  var addressInput = document.getElementById('filterAddress').value;
  var radInput = document.getElementById('filterRadius').value;

  if (magInput) {
    magRange[0] = parseInt(magInput, 10);
  }

  if (longInput && latInput && radInput) {
    var loc = new google.maps.LatLng(latInput, longInput);
    console.log(loc);
    searchLocation = loc;
    map.setZoom
    searchRadius = radInput;
    reloadMap();
    map.setCenter(loc);
  } else if (addressInput && radInput) {
    var loc;
    var test;
    geocoder.geocode({'address': addressInput}, function(results, status) {
      if (status == 'OK') {
        loc = results[0].geometry.location;
        test = 5;
        searchLocation = loc;
        searchRadius = radInput;
        reloadMap();
        map.setCenter(loc);
        return;
      } else {
        console.log('Geocoder couldn\'t find entered address');
      }
    });
  } else {
    reloadMap();
  }
  
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: new google.maps.LatLng(47.6062095,-122.3320708),
    mapTypeId: 'terrain'
  }); 
  geocoder = new google.maps.Geocoder();
  loadQuakes();
}

function reloadMap() {
  clearMarkers();
  loadQuakes();
  setBounds();
}

function clearMarkers() {
  for (var i=0; i<gMarkers.length; i++) {
    gMarkers[i].setMap(null);
  }
  gMarkers = [];
}

function loadQuakes() {
  var results = JSON.parse(localStorage.getItem('mapQuakes'));
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    if(filterMagnitude(results.features[i].properties.mag) && filterLocation(coords)) {
      var marker = new google.maps.Marker({
        position: {lat: coords[1], lng: coords[0]},
        map: map,
        icon: getIcon(results.features[i].properties.mag)
      });
      gMarkers.push(marker);
      marker.informationIndex = i;

      marker.addListener('click', function(e) {
      });
     
      var infowindow= new google.maps.InfoWindow({
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

function setBounds() {
  var bounds = new google.maps.LatLngBounds();
  for (var i=0; i<gMarkers.length; i++) {
    bounds.extend(gMarkers[i].getPosition());
  }
  map.fitBounds(bounds);
  if (map.getZoom() > 10) {
    map.setZoom(10);
  }
}

// Returns true if magnitude filter is not set, or if marker's magnitude falls within 

function filterMagnitude(quakeMag) {
  var willShow = true;
  var quakeMag = quakeMag;
  if(quakeMag < magRange[0] || quakeMag > magRange[1]) {
    willShow = false;
  }
  return willShow;
}

function filterLocation(position) {
  var willShow = true;
  var locOfMarker = new google.maps.LatLng(position[1], position[0]);
  if (searchLocation) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(locOfMarker, searchLocation) / 1609.34;
    if (distance > searchRadius) {
      willShow = false;
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


window.eqfeed_callback = function(results) { 
  console.log('entered eqfeed_callback');
  if (!localStorage.getItem('mapQuakes')) {
    console.log('no stored data');
    localStorage.setItem('mapQuakes', JSON.stringify(results));
  }
  initMap();
}




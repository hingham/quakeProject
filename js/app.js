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
  console.log('entered eqfeed_callback');
  localStorage.setItem('mapQuakes', JSON.stringify(results));
  loadQuakes(JSON.parse(localStorage.getItem('mapQuakes')));
}

function loadQuakes (results) {
  var results = results;
  console.log("loaded quakes");
  
  for (var i = 0; i < results.features.length; i++) {
    if(filterMagnitude(results.features[i].properties.mag)) {
      var coords = results.features[i].geometry.coordinates;
      console.log('loading feature');
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var marker = new google.maps.Marker({
          position: {lat: coords[1], lng: coords[0]},
          map: map,
          icon: getIcon(results.features[i].properties.mag)
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

//dorpdown
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showDropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.dropbtn')) {

  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
}
}
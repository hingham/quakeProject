function locTypeCheck() {
  var addrLabel = document.getElementById('addrLabel');
  var ltLngLabel = document.getElementById('ltLngLabel');
  if (document.getElementById("selectAddress").checked) {
    filtLat.style.display = "none";
    filtLng.style.display = "none";
    filtAddr.style.display = "block";
    filtRad.style.display = "block";
    addrLabel.style.backgroundColor = "white";
    ltLngLabel.style.backgroundColor = "darkgrey";
    filtLat.value = filtLat.defaultValue;
    filtLng.value = filtLng.defaultValue;
  }
  else if (document.getElementById("selectLatLng").checked) {
    filtLat.style.display = "block";
    filtLng.style.display = "block";
    filtAddr.style.display = "none";
    filtRad.style.display = "block";
    addrLabel.style.backgroundColor = "darkgrey";
    ltLngLabel.style.backgroundColor = "white";
    filtAddr.value = filtAddr.defaultValue;
  }
}
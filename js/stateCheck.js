
var body =document.getElementById('body');
var triggerShake = document.getElementById('shake');
var stateForm = document.getElementById('trigger-quake');
var reset = document.getElementById('reset-state');
var submit = document.getElementById('submit-state');

function addElement(element, content, parent) {
  var newElement = document.createElement(element);
  var newContent = document.createTextNode(content);
  newElement.appendChild(newContent);
  parent.appendChild(newElement);
  return newElement;
}

function removeElement(elementId) {
  // Removes an element from the document
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

var quakes = localStorage.getItem('mapQuakes');
var earthquakeInfo = JSON.parse(quakes);

var states = [];
var countries = [];

var allStates = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
var allCountries = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegowina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo, the Democratic Republic of the', 'Cook Islands', 'Costa Rica', 'Cote d\'Ivoire', 'Croatia (Hrvatska)', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'France Metropolitan', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and Mc Donald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, Democratic People\'s Republic of', 'Korea, Republic of', 'Kuwait', 'Kyrgyzstan', 'Lao, People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia, The Former Yugoslav Republic of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia (Slovak Republic)', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'Spain', 'Sri Lanka', 'St. Helena', 'St. Pierre and Miquelon', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen Islands', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Virgin Islands (British)', 'Virgin Islands (U.S.)', 'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Yugoslavia', 'Zambia', 'Zimbabwe'];

function lowerCasePlace(){
  for (var i = 0; i<allStates.length; i++){
    var lowerState = allStates[i].toLowerCase();
    states.push(lowerState);
  }

  for (var i = 0; i<allCountries.length; i++){
    var lowerCountry = allCountries[i].toLowerCase();
    countries.push(lowerCountry);
  }
}

lowerCasePlace();

stateForm.addEventListener('submit', handleSubmit);

function handleSubmit(event){

  event.preventDefault();
  var numberQuakes = 0;
  var quakeHappened = false;
  var largestQuake = 0;
  var placeExists = false;
  var userState = document.getElementById('user-state').value;
  userState = userState.toLowerCase();


  if(states.includes(userState) || countries.includes(userState)){
    placeExists = true;
    for (var j = 0; j < earthquakeInfo.features.length; j++){
      var placeLowerCase = earthquakeInfo.features[j].properties.place.toLowerCase();
      if (placeLowerCase.includes(userState)){
        body.setAttribute('class', 'shake');
        console.log(numberQuakes);
        numberQuakes++;
        quakeHappened = true;

        var quakeMag = parseInt(earthquakeInfo.features[j].properties.mag);
        //console.log('mag' + parseInt(earthquakeInfo.features[j].properties.mag));
        console.log('mag' + quakeMag);
        if(quakeMag > largestQuake){
          largestQuake = quakeMag;
          console.log('largest' + largestQuake);
        }
      }
    }
  }

  if(quakeHappened){
    var quakeContent = userState + ' has experienced ' + numberQuakes + ' earthquakes in the past 18 days.' + ' The largest of these earthquake was a magnitude ' + largestQuake +'!';
    addElement('p', quakeContent, stateForm);
    document.getElementsByTagName('p')[2].setAttribute('id', 'quakeReport');
    submit.style.display = 'none';
    reset.style.display = 'inline-block';
  }
  else if(placeExists && !quakeHappened){
    addElement('p', 'No earthquakes happened in '+ userState + 'in the last 18 days', stateForm);
    document.getElementsByTagName('p')[2].setAttribute('id', 'quakeReport');
    submit.style.display = 'none';
    reset.style.display = 'inline-block';
  }
  else{
    addElement('p', userState + ' is an invalid entry. Please try again.', stateForm);
    document.getElementsByTagName('p')[2].setAttribute('id', 'quakeReport');
    submit.style.display = 'none';
    reset.style.display = 'inline-block';
  }
}


reset.addEventListener('click', handleButton);

function handleButton(event){
  event.preventDefault();
  removeElement('quakeReport');
  body.removeAttribute('class', 'shake');
  submit.style.display = 'inline-block';
  reset.style.display = 'none';
}



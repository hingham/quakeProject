'use strict';
var attempt = 3;
var loggedIn = false;

function validate()
{
  var userName = ''// document.getElementById('userName').value;
  var password = ''//document.getElementById('password').value;

  if ( userName === 'admin' && password === 'admin')
  {
    alert ('Login successfully');
    loggedIn = true;
    console.log(loggedIn);
    window.location = 'admin.html';
    return false;
  }
  else
  {
    attempt --;
    alert('Incorrect username / password combination.  You have left ' + attempt + ' attempt before you will be locked out.');
    if( attempt < 1)
    {
      document.getElementById('userName').disabled = true;
      document.getElementById('password').disabled = true;
      document.getElementById('loginSubmit').disabled = true;
      return false;
    }
  }
}

function loginSubmit(event)
{
  event.preventDefault();
  validate();
}

addEventListener('submit', loginSubmit);

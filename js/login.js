'use strict';
var attempt = 3; //Variable to count number of attempts
var loggedIn = false;

//Below function Executes on click of login button
function validate(){
	var userName = document.getElementById("userName").value;
	var password = document.getElementById("password").value;

    if ( userName === "admin" && password == "admin")
    {
        alert ("Login successfully");
        loggedIn = true;
		window.location = "admin.html"; //redirecting to other page
		return false;
	}
    else
    {
		attempt --;
		alert("Incorrect username / password combination.  You have left " + attempt + " attempt before you will be locked out.");
        if( attempt < 1)
        {
			document.getElementById("username").disabled = true;
			document.getElementById("password").disabled = true;
			document.getElementById("loginSubmit").disabled = true;
			return false;
		}
	}
}

function handleSubmit(event)
{
    event.preventDefault();
    validate();s
}
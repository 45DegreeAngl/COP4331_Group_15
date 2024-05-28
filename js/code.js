const urlBase = 'http://cop4331summer-test.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;

	//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	if(!login || !password) {
		document.getElementById("loginResult").innerHTML = "Please fill out all fields.";
		return;
	}


	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contactManager.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function goBack(){
	window.location.href = "signup-login.html";
}

function goToSignup(){
	window.location.href = "signup.html";
}

function goToIndex(){
	window.location.href = "index.html";
}


function doSignUp(event) {

	event.preventDefault();

	let firstName = document.getElementById("signupFirstName").value;
	let lastName = document.getElementById("signupLastName").value;
	let login = document.getElementById("signupUsername").value;
	let password = document.getElementById("signupPassword").value;

	document.getElementById("signinResultMessage").innerHTML = "";

	if( !firstName || !lastName || !login || !password) {
		document.getElementById("signinResultMessage").innerHTML = "Please fill out all fields.";
		return;
	}

	/* Validation */
	let userValidation = {Login: login};
	let validationjsonPayload = JSON.stringify( userValidation );
	let validationUrl = urlBase + '/ValidateSignUp.' + extension;

	let validationXhr = new XMLHttpRequest();
	validationXhr.open("POST", validationUrl, true);
	validationXhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


	try
	{
		validationXhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				validationJsonObject = JSON.parse(this.responseText);

				if (validationJsonObject.error && validationJsonObject.error.length > 0) {
					document.getElementById("signinResultMessage").innerHTML = validationJsonObject.error;
				} else {
					
					/* Username is unqiue & no errors found. Continue with sign up. */

					let newUser = {FirstName: firstName, LastName: lastName, Login: login, Password: password};
					let jsonPayload = JSON.stringify( newUser );

					let url = urlBase + '/SignUp.' + extension;
					
					let xhr = new XMLHttpRequest();
					xhr.open("POST", url, true);
					xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
					try
					{
						xhr.onreadystatechange = function() 
						{
							if (this.readyState == 4 && this.status == 200) 
							{
								firstName.value = '';
								lastName.value = '';
								login.value = '';
								password.value = '';
								document.getElementById("signinResultMessage").innerHTML = "User successfully signed up!\nPlease press 'Back' and login.";
							}
						};
						xhr.send(jsonPayload);
					}
					catch(err)
					{
						document.getElementById("signinResultMessage").innerHTML = err.message;
					}
				}
			}
		};
		validationXhr.send(validationjsonPayload);
	}
	catch(err)
	{
		document.getElementById("signinResultMessage").innerHTML = err.message;
	}

	

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("welcomeMessage").innerHTML = "Welcome back, " + firstName + " " + lastName + "!";
	}
}

function getUserIdFromCookie()
{
	let userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] === "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }
    return userId;
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function display(formId) {
    document.getElementById('addContactDiv').style.display = 'none';
	document.getElementById('searchDiv').style.display = 'none';
	document.getElementById('contactsListDiv').style.display = 'none';
    document.getElementById(formId).style.display = 'block';
	if (formId == 'searchDiv')
		document.getElementById('contactsListDiv').style.display = 'block';
	document.getElementsByClassName('search-add-buttons-container')[0].style.display = 'none';
}
function displaySearchAddButtons() {
    document.getElementById('addContactDiv').style.display = 'none';
	document.getElementById('searchDiv').style.display = 'none';
	document.getElementById('contactsListDiv').style.display = 'none';
	document.getElementsByClassName('search-add-buttons-container')[0].style.display = 'flex';
}


function searchContact()
{

}

function addContact(event) {
    event.preventDefault();

	//clear all messages
    document.getElementById('firstNameError').style.display = 'none';
    document.getElementById('lastNameError').style.display = 'none';
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('phoneError').style.display = 'none';

	//read input
	var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var userId = getUserIdFromCookie(); 

    // validate input
    var isValid = true;

    if (!firstName) {
        document.getElementById('firstNameError').innerText = 'First name is required.';
        document.getElementById('firstNameError').style.display = 'block';
        isValid = false;
    }

    if (!lastName) {
        document.getElementById('lastNameError').innerText = 'Last name is required.';
        document.getElementById('lastNameError').style.display = 'block';
        isValid = false;
    }

	//validate email address format
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').innerText = 'Please enter a valid email address.';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

	//validate number format
    var phonePattern = /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/;
    if (!phonePattern.test(phone)) {
        document.getElementById('phoneError').innerText = 'Please enter a valid phone number.';
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // group the data to send it
    var data = {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
        UserID: userId
    };

    // create ajax request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'LAMPAPI/AddContact.php', true); //path to api endpoint file
    xhr.setRequestHeader('Content-Type', 'application/json');

    // process server response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.error === "") {
                document.getElementById('contactAddResult').innerText = 'Contact added successfully!';
                document.getElementById('contactAddResult').style.color = 'green';
                document.getElementById('addContactForm').reset();
            } else {
                document.getElementById('contactAddResult').innerText = 'Failed to add contact: ' + response.error;
                document.getElementById('contactAddResult').style.color = 'red';
            }
        }
    };
    // Send the request with the data
    xhr.send(JSON.stringify(data));
}




function editContact(contactId) {
    
}

function deleteContact(contactId) {
   
}
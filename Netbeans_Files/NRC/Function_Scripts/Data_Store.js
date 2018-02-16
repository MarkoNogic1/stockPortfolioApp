//So what we need to do here is pull info from a database if we're logged on but with NULL user/email cookie, then store that info onto a cookie to read later.
//As a test, we'll pull BS values from a test function.


//This is mostly a testing script. We'll probably cannibalize this file for its methods to place in other files.
//Otherwise, we can have this as a general collection.

function getFromDB(data_request, acct_ID)
{
	//The purpose of this function is a general all-purpose Database grab, but for now its implementation is placeholder
	datstrem = null;
	//These are temporary until we get more on the Database
	if (acct_ID === 123)
	{
		if (data_request.localeCompare("user") === 0)
		{
			datstrem = "Luke Skywalker";
		}
		if (data_request.localeCompare("email") === 0)
		{
			datstrem = "YoungPadawan77@Tatoonie.com";
		}
	}

	return datstrem;
}

function loginCookieStore(idNumber)
{
	//After logging in we'll get an associated id. Here, we call the Database (for now a placeholder function) to store info in a cookie to be
	//Used later.
	namevalue = getFromDB("user", idNumber) + ";"; //The ";" is a required part of the cookie, as it's part of the string formatting.
	emailvalue = getFromDB("email", idNumber) + ";"; //Here's the email
        document.cookie="name=" + namevalue; //and here's the stored cookie. name and email as separate cookies, the ; in each variable
        document.cookie="email=" + emailvalue;
}







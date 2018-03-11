

function displayAcctOnPage()
{

	user = null;
	email = null;
	//So, here we're going to check the contents of the cookie. The cookie's info should be pre-loaded by this point.
	var allcookies = document.cookie; 
	cookiearray = allcookies.split(';');

	for(var i=0; i<cookiearray.length; i++)
	{
		//Handy. We'll go through the whole thing, splitting each string further by = to get name and value. Here, now we can check.
		nomen = cookiearray[i].split('=')[0];
		val = cookiearray[i].split('=')[1];
                check01 = "name"
                check02 = "email"
		if(nomen.trim() === check01.trim()) //Here we go. Find if we're looking at id.
		{
			user = val;
		}
                if(nomen.trim() === check02.trim()) //Here we go. Find if we're looking at id.
		{
			email = val;
		}
	}

	//TODO: This is 100% Temporary. These values, in the final, will be outputted somewhere else to be written to the top left.
	document.write(user + "<br>");
        document.write(email);

}

function initialize()
{
	id = null;
	var allcookies = document.cookie; 
	cookiearray = allcookies.split(';');

	for(var i=0; i<cookiearray.length; i++)
	{
		//Handy. We'll go through the whole thing, splitting each string further by = to get name and value. Here, now we can check.
		nomen = cookiearray[i].split('=')[0];
		val = cookiearray[i].split('=')[1];
		if(nomen.localeCompare("id") === 0) //Here we go. Find if we're looking at id.
		{
			id = parseInt(val);
		}
	}

	loginCookieStore(id);
	displayAcctOnPage();
}









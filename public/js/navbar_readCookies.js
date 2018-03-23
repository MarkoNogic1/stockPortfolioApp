//So, here we're going to check the contents of the cookie. The cookie's info should be pre-loaded by this point.
var allcookies = document.cookie;
var check01 = "user";
var check02 = "email";
var cookiearray = allcookies.split(';');

for(var i=0; i<cookiearray.length; i++)
{
    //Handy. We'll go through the whole thing, splitting each string further by = to get name and value. Here, now we can check.
    var nomen = cookiearray[i].split('=')[0];
    var val = cookiearray[i].split('=')[1];

    if(nomen.trim() === check01.trim()) //Here we go. Find if we're looking at id.
    {
        var user = val;
    }
    if(nomen.trim() === check02.trim()) //Here we go. Find if we're looking at id.
    {
        var email = val;
    }
}

document.getElementById("displayname").textContent = String(user);
document.getElementById("displayemail").textContent = String(email);
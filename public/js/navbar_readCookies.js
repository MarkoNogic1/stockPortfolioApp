//So, here we're going to check the contents of the cookie. The cookie's info should be pre-loaded by this point.
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        var gotcha = this.responseText;
        var values = gotcha.split("&");

        document.getElementById("displayname").innerHTML = values[0];
        document.getElementById("displayemail").innerHTML = values[1];

        document.getElementById("SETTINGusername").innerHTML = "Username: " + values[0];
        document.getElementById("SETTINGemail").innerHTML = "Email: " + values[1];
        document.getElementById("SETTINGfirstname").innerHTML = "First Name: " + values[2];
        document.getElementById("SETTINGlastname").innerHTML = "Last Name: " + values[3];
    }
};

xhttp.open("GET", "/getnavbardata", true);
xhttp.send();
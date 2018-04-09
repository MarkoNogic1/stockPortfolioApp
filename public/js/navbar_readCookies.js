//So, here we're going to check the contents of the cookie. The cookie's info should be pre-loaded by this point.
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        var gotcha = this.responseText;
        var values = gotcha.split("&");

        document.getElementById("displayname").innerHTML = values[0];
        document.getElementById("displayemail").innerHTML = values[1];
    }
};

xhttp.open("GET", "/getnavbardata", true);
xhttp.send();
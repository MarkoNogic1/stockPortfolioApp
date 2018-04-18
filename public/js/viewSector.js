google.charts.load('current', {'packages':['corechart', 'table']});

new Promise(function (resolve, reject)
{
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.open("GET", "/getSectors", true);
    xhttp.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            var jsonResponse = this.response;

            for (var sector in jsonResponse){
                $("#sectorSelector").append(`<option value=\"${jsonResponse[sector]["sectorname"]}\">${jsonResponse[sector]["sectorname"]}</option>`);
            }
        }
    };
    xhttp.send();
});
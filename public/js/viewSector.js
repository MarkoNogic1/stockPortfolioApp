//Load dropdown with sector names
$(document).ready(function(){
    getUserPortfolioData();

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

    $( "#sectorSelector" ).change(function() {
        populateSectorGraph($("#sectorSelector").val());
    });
});

function populateSectorGraph(sectorName){
    var http = new XMLHttpRequest();
    http.open("GET", "/getSummaryData");
    http.send();
    http.onload = function() {
        if (this.readyState === 4 && this.status === 200) {
            var sectorGraphData = [['Stock','Value']];
            var jsonResponse = JSON.parse(this.response);
            for (var stockIndex in jsonResponse){
                if (sectorName === jsonResponse[stockIndex]["sectorname"])
                    sectorGraphData.push([jsonResponse[stockIndex]["stockname"], parseFloat(jsonResponse[stockIndex]["stockvalue"])]);
            }

            var data = google.visualization.arrayToDataTable(sectorGraphData);

            var chart = new google.visualization.PieChart(document.getElementById('pieChart'));

            var options = {chartArea: {width: '100%', height: '100%'}};

            chart.draw(data, options);
        }
    };
}










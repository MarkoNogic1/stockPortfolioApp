//Load dropdown with sector names
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


$(document).ready(function(){
    $( "#sectorSelector" ).change(function() {
        populateSectorGraph($("#sectorSelector").val());
    });
});

function populateSectorGraph(sectorName){
    var panelHeading = $("<div></div>").addClass("panel-heading");
    var symbol = $("<i></i>").addClass("fa fa-bar-chart-o fa-fw");
    panelHeading.append(symbol).append("Sector: " + sectorName);

    $("#graph").empty();
    $("#graph").append(panelHeading);

    var panelBody = $("<div></div>").addClass("panel-body");
    //var graphContainer = $("<div></div>").attr("id", "graphContainer");

    //panelBody.append(graphContainer);
    $("#graph").append(panelBody);

    var http = new XMLHttpRequest();   // new HttpRequest instance
    http.open("POST", "/getStocksBySector");
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.onload = function () {
        if (http.readyState === 4 && http.status === 200){
            var json = JSON.parse(http.responseText);

            var pieGraphStockTokens = []
            for (var stockKey in json){
                pieGraphStockTokens.push(json[stockKey]["stockname"]);
            }

            var pieGraphData = [];
            var timeSeries = TimeSeriesEnum.BATCH;
            var timeSeriesIndicator = getJsonTimeSeriesIndicator(timeSeries);
            requestStockData(pieGraphStockTokens, timeSeries).then(function (response) {
                var stockData = JSON.parse(response);

                for (var key in stockData[timeSeriesIndicator]) {
                    pieGraphData = `{label: ${stockData[timeSeriesIndicator][key]["1. symbol"]}, data: ${parseFloat(stockData[timeSeriesIndicator][key]["2. price"])})`;
                }
                var options = {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 0.8,
                                threshold: 0.1
                                //formatter: "labelFormatter"
                            }
                        }
                    }
                };
                console.log("draw data here");
                $.plot($("#piePlaceholder"), pieGraphData, options);
            });
        }
    };
    const body = '{"sectorName":"' + sectorName + '"}';
    http.send(body);
}










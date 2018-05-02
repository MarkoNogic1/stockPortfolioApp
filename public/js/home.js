
//=====================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  OUTER FUNCTIONS  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//=====================================================================================================================
//const arrayColumn = (arr, n) => arr.map(x => x[n]);
getUserPortfolioData();


//=====================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  CALLED FUNCTIONS  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//=====================================================================================================================
$(document).ready(function() {
    $("#portfolioBubble").click(function () {
        $(".panel-background").removeClass("selected");
        $("#portfolioBubble").addClass("selected");
        $("#summaryPanelHeading").html("<i class=\"fa fa-list-alt fa-fw\"></i>All Sectors");
        populateSummaryTable();
    });
});

function generateSectorBubbles(sectorsWithPrices){
    for (var sector in sectorsWithPrices) {
        var bubble = $("<div></div>").addClass("col-md-3");
        var panel = $("<div></div>").addClass("panel panel-background");
        var panelHeading = $("<div></div>").addClass("panel-heading");
        var row = $("<div></div>").addClass("row");
        var symbolCol = $("<div></div>").addClass("col-xs-3");
        var textCol = $("<div></div>").addClass("col-xs-9 text-right");
        var symbol = $("<i></i>").addClass("fa fa-5x");
        var sectorText = $("<div></div>").append(sectorsWithPrices[sector][0]).addClass("sectorLabel");
        var priceText = $("<div></div>").addClass("huge").append('$' + sectorsWithPrices[sector][1].toFixed(2));

        if (sector % 3 == 0)
            panel.addClass("panel-green");
        else if (sector % 2 == 0)
            panel.addClass("panel-primary");
        else
            panel.addClass("panel-yellow");

        //symbol.addClass("fa-arrow-circle-down");

        textCol.append(priceText);
        textCol.append(sectorText);
        symbolCol.append(symbol);
        row.append(symbolCol);
        row.append(textCol);
        panelHeading.append(row);
        panel.append(panelHeading);
        bubble.append(panel);
        bubble.addClass("bubble");

        $("#bubbleContainer").append(bubble);
    }
    var bubbles = $(".bubble");
    for (var i = 0; i < bubbles.length; i++) {
        bubbles[i].addEventListener("click", function (e) {
            var sectorName = $(this).find(".sectorLabel")[0].innerText;

            $(".panel-background").removeClass("selected");
            $(this).find(".panel-background").addClass("selected");
            $("#summaryPanelHeading").html("<i class=\"fa fa-list-alt fa-fw\"></i>Sector: " + sectorName);

            populateSummaryTable(sectorName);
        });
    }
}

function populateSummaryTable(sector) {
    var http = new XMLHttpRequest();
    http.open("GET", "/getSummaryData");
    http.send();
    http.onload = function() {
        if (this.readyState === 4 && this.status === 200){
            var jsonResponse = JSON.parse(this.response);
            var summaryData = [['Stock Token', 'Current Value']];
            for (var stockIndex in jsonResponse){
                if (sector === undefined || sector === jsonResponse[stockIndex]["sectorname"])
                    summaryData.push([jsonResponse[stockIndex]["stockname"], parseFloat(jsonResponse[stockIndex]["stockvalue"])]);
            }
            var data = google.visualization.arrayToDataTable(summaryData);

            var table = new google.visualization.Table(document.getElementById('table'));

            table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});

            google.visualization.events.addListener(table, 'select', tableRowClick);

            populateGraph(summaryData[1][0]);

            function tableRowClick(){
                var selectedRow = table.getSelection()[0].row;
                var selectedToken = summaryData[selectedRow + 1][0];
                populateGraph(selectedToken);
            }
        }
    };
}

function getSectorsWithPrices() {
    var http = new XMLHttpRequest();
    http.open("GET", "/getSectorsWithPrices");
    http.send();
    http.onload = function() {
        if (this.readyState === 4 && this.status === 200){
            var jsonResponse = JSON.parse(this.response);
            var sectorsWithPrices = [];
            for (var sector in jsonResponse){
                sectorsWithPrices.push([jsonResponse[sector]["sectorname"],jsonResponse[sector]["price"]]);
            }
            generateSectorBubbles(sectorsWithPrices);
        }
    };
}

function populateGraph(stockToken) {
    $("#stockTrackerHeader").html("<i class=\"fa fa-bar-chart-o fa-fw\"></i>Stock Tracker: " + stockToken);

    var graphData = [['Date', 'Price']];
    var graphTimeSeries = TimeSeriesEnum.WEEKLY;
    var graphTimeSeriesIndicator = getJsonTimeSeriesIndicator(graphTimeSeries);
    requestStockData(stockToken, graphTimeSeries).then(function (response) {
        var stockData = JSON.parse(response);
        if (stockData.hasOwnProperty("Information")) {
            $('#chart').empty();
            $('#chartError').html('Uh oh! Alpha Vantage API says: "' + stockData["Information"] + '". '+ "<br /><br />" + 'Please wait a few seconds and try again!');
        }
        else {
            $('#chartError').empty();

            for (var key in stockData[graphTimeSeriesIndicator]) {
                graphData.push([key, parseFloat(stockData[graphTimeSeriesIndicator][key]["1. open"])]);
            }

            var data = google.visualization.arrayToDataTable(graphData);

            var options = {
                title: `${stockToken}: Price History`,
                legend: {position: 'bottom'},
                width: '100%',
                height: '100%',
                vAxis: {
                    title: 'Price (USD)'
                },
                hAxis: {
                    title: 'Date',
                    direction: '-1'
                }
            };

            var chart = new google.visualization.LineChart(document.getElementById('chart'));

            chart.draw(data, options);
        }
    });
}


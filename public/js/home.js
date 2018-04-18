//=====================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  CLASSES  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//=====================================================================================================================
class UserPortfolioData{
    constructor(_sectors){
        this.sectors = _sectors;
    }
}

class Sector{
    constructor(_sectorName, _stocks){
        this.sectorName = _sectorName;
        this.stocks = _stocks;
    }
}

class Stock{
    constructor(_tokenName, _tokenShares,_tokenSector, _tokenDate, _tokenValue){
        this.tokenName = _tokenName;
        this.tokenShares = _tokenShares;
        this.tokenSector = _tokenSector;
        this.tokenDate = _tokenDate;
        this.tokenValue = _tokenValue;
    }
}

//=====================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  OUTER FUNCTIONS  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//=====================================================================================================================
google.charts.load('current', {'packages':['corechart', 'table']});
const arrayColumn = (arr, n) => arr.map(x => x[n]);

var userData;
var stockTokens = [];

getUserPortfolioData()

//=====================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  CALLED FUNCTIONS  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//=====================================================================================================================
$(document).ready(function() {
    $("#portfolioBubble").click(function () {
        $(".panel-background").removeClass("selected");
        $("#portfolioBubble").addClass("selected");
        $("#summaryPanelHeading").html("<i class=\"fa fa-list-alt fa-fw\"></i>All Sectors");
        populateSummaryTable(stockTokens);
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

            for (var sectorIndex in userData.sectors){
                if (userData.sectors[sectorIndex].sectorName === sectorName){
                    populateSummaryTable(userData.sectors[sectorIndex].stocks);
                    break;
                }
            }
        });
    }
}

function populateSummaryTable(stockTokens) {
    var summaryData = [['Stock Token', 'Current Value']];
    var summaryTimeSeries = TimeSeriesEnum.BATCH;
    var summaryTimeSeriesIndicator = getJsonTimeSeriesIndicator(summaryTimeSeries);
    requestStockData(stockTokens, summaryTimeSeries).then(function (response) {
        var stockData = JSON.parse(response);

        for (var key in stockData[summaryTimeSeriesIndicator]) {
            summaryData.push([stockData[summaryTimeSeriesIndicator][key]["1. symbol"], parseFloat(stockData[summaryTimeSeriesIndicator][key]["2. price"])]);
        }

        var data = google.visualization.arrayToDataTable(summaryData);

        var table = new google.visualization.Table(document.getElementById('table'));

        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});

        google.visualization.events.addListener(table, 'select', tableRowClick);

        populateGraph(stockTokens[0]);

        function tableRowClick(){
            var selectedRow = table.getSelection()[0].row;
            var selectedToken = summaryData[selectedRow + 1][0];
            populateGraph(selectedToken);
        }
    });
}

function getSectorsWithPrices(sectorData, stockTokens) {
    var timeSeries = TimeSeriesEnum.BATCH;
    var timeSeriesIndicator = getJsonTimeSeriesIndicator(timeSeries);
    var sectorsWithPrices = [];

    requestStockData(stockTokens, timeSeries).then(function (response) {
        var stockData = JSON.parse(response)[timeSeriesIndicator];
        for (var i in sectorData) {
            sectorsWithPrices.push([sectorData[i]["sectorname"], 0]);
        }

        for (var tokenAPI in stockData) {
            for (var sectorIndex in sectorData){
                if (sectorData[sectorIndex]["stocks"].search(stockData[tokenAPI]["1. symbol"]) !== -1){
                    sectorsWithPrices[sectorIndex][1] += parseFloat(stockData[tokenAPI]["2. price"]);
                }
            }
        }

        generateSectorBubbles(sectorsWithPrices);
    });
}

function populateGraph(stockToken) {
    $("#stockTrackerHeader").html("<i class=\"fa fa-bar-chart-o fa-fw\"></i>Stock Tracker: " + stockToken);

    var graphData = [['Date', 'Price']];
    var graphTimeSeries = TimeSeriesEnum.WEEKLY;
    var graphTimeSeriesIndicator = getJsonTimeSeriesIndicator(graphTimeSeries);
    requestStockData(stockToken, graphTimeSeries).then(function (response) {
        var stockData = JSON.parse(response);

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
                title: 'Price (USD)'},
            hAxis: {
                title: 'Date',
                direction: '-1'}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart'));

        chart.draw(data, options);
    });
}

function getUserPortfolioData()
{
    return new Promise(function (resolve, reject)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        xhttp.open("GET", "/getUserPortfolioData", true);
        xhttp.onload = function ()
        {
            if (this.readyState === 4 && this.status === 200)
            {
                var jsonResponse = this.response;
                var sectors = [];
                stockTokens = ""; //for ALL sectors

                for (var sector in jsonResponse){
                    stockTokens += jsonResponse[sector]["stocks"] + ",";
                    var stocks = jsonResponse[sector]["stocks"].split(",");
                    var sector = new Sector(jsonResponse[sector]["sectorname"], stocks);
                    sectors.push(sector);
                }
                stockTokens = stockTokens.split(",");
                userData = new UserPortfolioData(sectors);

                populateSummaryTable(stockTokens);
                getSectorsWithPrices(jsonResponse, stockTokens);
            }

        };
        xhttp.send();
    });
}






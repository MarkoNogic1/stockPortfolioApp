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
    constructor(_tokenName){
        this.tokenName = _tokenName;
    }
}

google.charts.load('current', {'packages':['corechart', 'table']});
const arrayColumn = (arr, n) => arr.map(x => x[n]);

var userData = getUserPortfolioData();
var stockTokens = [];
for (var i in userData.sectors){
    for (var j in userData.sectors[i].stocks)
        stockTokens.push(userData.sectors[i].stocks[j]["tokenName"]);
}

populateSummaryTable(stockTokens);
getSectorsWithPrices();

$(document).ready(function() {
    $("#portfolioBubble").click(function () {
        $(".panel-background").removeClass("selected");
        $("#portfolioBubble").addClass("selected");
        populateSummaryTable(stockTokens);
    });
});

function generateSectorBubbles(sectorsWithPrices){
    for (var sector in sectorsWithPrices) {
        var bubble = $("<div></div>").addClass("col-lg-3 col-md-6");
        var panel = $("<div></div>").addClass("panel");
        var panelHeading = $("<div></div>").addClass("panel-heading");
        var row = $("<div></div>").addClass("row");
        var symbolCol = $("<div></div>").addClass("col-xs-3");
        var textCol = $("<div></div>").addClass("col-xs-9 text-right");
        var symbol = $("<i></i>").addClass("fa fa-5x");
        var sectorText = $("<div></div>").append(sectorsWithPrices[sector][0]).addClass("sectorLabel");
        var priceText = $("<div></div>").addClass("huge").append('$' + sectorsWithPrices[sector][1].toFixed(2));

        panel.addClass("panel-background");
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
            $(".panel-background").removeClass("selected");
            $(this).find(".panel-background").addClass("selected");
            var sectorName = $(this).find(".sectorLabel")[0].innerText;
            $("#summaryPanelHeading").html("<i class=\"fa fa-list-alt fa-fw\"></i>Sector: " + sectorName);
            populateSummaryTable(arrayColumn(getSectorByName(userData.sectors, sectorName)[0].stocks,"tokenName"));
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

function getSectorsWithPrices() {
    var timeSeries = TimeSeriesEnum.BATCH;
    var timeSeriesIndicator = getJsonTimeSeriesIndicator(timeSeries);
    var sectorsWithPrices = [];

    requestStockData(stockTokens, timeSeries).then(function (response) {
        var stockData = JSON.parse(response)[timeSeriesIndicator];

        for (var i in userData.sectors){
            sectorsWithPrices.push([userData.sectors[i].sectorName, 0]);
            var stocks = userData.sectors[i].stocks;

            for (var tokenAPI in stockData) {
                for (var tokenDB in stocks){
                    if (stockData[tokenAPI]["1. symbol"] === stocks[tokenDB].tokenName)
                        sectorsWithPrices[i][1] += parseFloat(stockData[tokenAPI]["2. price"]);
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

function getUserPortfolioData(){
    var retailStocks = new Array();
    var techStocks = new Array();
    var commStocks = new Array();

    retailStocks.push(new Stock("WAL"));
    retailStocks.push(new Stock("LOW"));
    techStocks.push(new Stock("AMD"));
    techStocks.push(new Stock("FB"));
    techStocks.push(new Stock("MSFT"));
    commStocks.push(new Stock("T"));

    var sectors = [new Sector("Retail", retailStocks), new Sector("Technology", techStocks), new Sector("Communication", commStocks)];

    var data = new UserPortfolioData(sectors);
    return data;
}

function getSectorByName(data, sectorName) {
    return data.filter(
        function(data){ return data.sectorName === sectorName }
    );
}

// credits: richard maloney 2006
function getTintedColor(color, v) {
    if (color.length >6) { color= color.substring(1,color.length)}
    var rgb = parseInt(color, 16);
    var r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
    var g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
    var b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
    r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16);
    if (r.length == 1) r = '0' + r;
    g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16);
    if (g.length == 1) g = '0' + g;
    b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16);
    if (b.length == 1) b = '0' + b;
    return "#" + r + g + b;
}




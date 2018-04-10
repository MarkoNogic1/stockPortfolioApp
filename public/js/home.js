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




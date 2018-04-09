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

var stockTokens = ["WAL", "MSFT","FB","AMD","LOW","T","ALL"];


populateGraph(stockTokens[0]);
populateSummaryTable();
console.log(getUserPortfolioData());

$(document).ready(function() {
    var sectorsWithPrices = [
        ["Retail", "$94.01", true],//Sector Name, Current Value, isIncreasingInValue
        ["Technology", "$343.88", false],
        ["Telecommunications", "$11.00", false],
        ["Insurance", "$27.00", false]
    ]

    for (var sector in sectorsWithPrices) {
        var bubble = $("<div></div>").addClass("col-lg-3 col-md-6");
        var panel = $("<div></div>").addClass("panel");
        var panelHeading = $("<div></div>").addClass("panel-heading");
        var row = $("<div></div>").addClass("row");
        var symbolCol = $("<div></div>").addClass("col-xs-3");
        var textCol = $("<div></div>").addClass("col-xs-9 text-right");
        var symbol = $("<i></i>").addClass("fa fa-5x");
        var sectorText = $("<div></div>").append(sectorsWithPrices[sector][0]);
        var priceText = $("<div></div>").addClass("huge").append(sectorsWithPrices[sector][1]);

        if (sectorsWithPrices[sector][2]) {
            panel.addClass("panel-green");
            symbol.addClass("fa-arrow-circle-up");
        }
        else {
            panel.addClass("panel-red");
            symbol.addClass("fa-arrow-circle-down");
        }

        textCol.append(priceText);
        textCol.append(sectorText);
        symbolCol.append(symbol);
        row.append(symbolCol);
        row.append(textCol);
        panelHeading.append(row);
        panel.append(panelHeading);
        bubble.append(panel);

        console.log(bubble);
        $("#bubbleContainer").append(bubble);
    }
});

function populateSummaryTable() {
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

        function tableRowClick(){
            var selectedRow = table.getSelection()[0].row;
            var selectedToken = summaryData[selectedRow + 1][0];
            populateGraph(selectedToken);
        }
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
    return JSON.stringify(data);
}

//DATABASE READ SECTION

function buildPortfolioFromDB()
{
    //What to do:
    //XMLrequest for the database's string.
    //Break it apart and call the function for each entry.
    var xhttp = new XMLHttpRequest();
    //What to do when the data is ready.
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200 && this.responseText !== undefined && this.responseText !== 'undefined' && this.responseText !== 'null' && this.responseText !== null && this.responseText !== '')
        {
            var longstring = this.responseText;


            var portarray = longstring.split("&");

            for (var index = 0; index < portarray.length; ++index)
            {
                var stock = portarray[index];

                if(stock !== undefined && stock !== 'undefined' && stock !== 'null' && stock !== null && stock !== '')
                {
                    var values = stock.split("^");
                    var stockID = values[0];
                    var stockName = values[1];
                    var stockNumber = values[2];
                    var stockSector = values[3];
                    var stockDate = values[4];

                    createStockHTML(stockID, stockName, stockNumber, stockSector, stockDate);
                }
            }
        }
    };

    //The call
    xhttp.open("GET", "/getPortfolioData", true);
    xhttp.send();
}

//============================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ANDY AND MCKENZIE ZONE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//============================================================================================
function createStockHTML(ID, name, Number, Sector, Date)
{
    //stuff
}
google.charts.load('current', {'packages':['corechart', 'table']});

var stockTokens = ["WAL", "MSFT","FB","AMD","LOW","T","ALL"];

var stockData = [];
var summaryData = [['Stock Token', 'Current Value']];
var summaryTimeSeries = TimeSeriesEnum.BATCH;
var summaryTimeSeriesIndicator = getJsonTimeSeriesIndicator(summaryTimeSeries);
requestStockData(stockTokens, summaryTimeSeries).then(function (response){
    stockData = JSON.parse(response);

    console.log(stockData[summaryTimeSeriesIndicator]);
    for(var key in stockData[summaryTimeSeriesIndicator]) {
        summaryData.push([stockData[summaryTimeSeriesIndicator][key]["1. symbol"], parseFloat(stockData[summaryTimeSeriesIndicator][key]["2. price"])]);
    }
    console.table(summaryData);

    var data = google.visualization.arrayToDataTable(summaryData);

    var table = new google.visualization.Table(document.getElementById('table'));

    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
});



var stockData = [];
var graphData = [['Date', 'Price']];
var graphTimeSeries = TimeSeriesEnum.WEEKLY;
var graphTimeSeriesIndicator = getJsonTimeSeriesIndicator(graphTimeSeries);
requestStockData(stockTokens[0], graphTimeSeries).then(function(response){
    stockData = JSON.parse(response);

    for(var key in stockData[graphTimeSeriesIndicator]) {
        graphData.push([key, parseFloat(stockData[graphTimeSeriesIndicator][key]["1. open"])]);
    }

    var data = google.visualization.arrayToDataTable(graphData);

    var options = {
        title: 'Stock Value',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));

    chart.draw(data, options);
});



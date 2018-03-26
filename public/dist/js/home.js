google.charts.load('current', {'packages':['corechart']});

var stockTokens = ["DAX", "HSI","FTSE","DJIA"];
var timeSeries = TimeSeriesEnum.WEEKLY;
var timeSeriesIndicator = getJsonTimeSeriesIndicator(TimeSeriesEnum.WEEKLY);

var stockData = [];
var graphData = [['Date', 'Price']];

requestStockData(stockTokens[0], timeSeries).then(function(response){
    stockData = JSON.parse(response);
    //console.log(stockData[timeSeriesIndicator]);

    for(var key in stockData[timeSeriesIndicator]) {
        graphData.push([key, parseFloat(stockData[timeSeriesIndicator][key]["1. open"])]);
    }
    console.table(graphData);

    var data = google.visualization.arrayToDataTable(graphData);

    var options = {
        title: 'Stock Value',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));

    chart.draw(data, options);
});
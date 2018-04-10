/***************TESTING*******************/
var result = {
    good: 0,
    bad: 0
};

function testGetJsonTimeSeriesIndicator(timeSeries, expected){
    if (getJsonTimeSeriesIndicator(timeSeries) === expected) {
        result.good++;
    }
    else
        result.bad++;
}

testGetJsonTimeSeriesIndicator(TimeSeriesEnum.BATCH, "Stock Quotes");
testGetJsonTimeSeriesIndicator(TimeSeriesEnum.WEEKLY,"Weekly Time Series");
testGetJsonTimeSeriesIndicator(TimeSeriesEnum.MONTHLY,"Monthly Time Series");
testGetJsonTimeSeriesIndicator(TimeSeriesEnum.INTRADAY,"Time Series (15min)");
testGetJsonTimeSeriesIndicator(TimeSeriesEnum.DAILY,"Time Series (Daily)");
testRequestStockData();

function testRequestStockData(){
    requestStockData("FB",TimeSeriesEnum.DAILY).then(function(response){
        if (response)
            result.good++;
            console.log(`Of ${result.good + result.bad} tests, ${result.good} passed and ${result.bad} failed.`);
    }).catch(function() {
        result.bad++;
        console.log(`Of ${result.good + result.bad} tests, ${result.good} passed and ${result.bad} failed.`);
    });
}
var TimeSeriesEnum = {
    INTRADAY: 1,
    DAILY: 2,
    WEEKLY: 3,
    MONTHLY: 4
};

const API_KEY = "YGFY7TCSV5V6I7JN";

function requestStockData(stockToken, timeSeries){
    var timeSeriesToken;
    switch (timeSeries) {
        case TimeSeriesEnum.DAILY:
            timeSeriesToken = "TIME_SERIES_DAILY";
            break;
        case TimeSeriesEnum.INTRADAY:
            timeSeriesToken = "TIME_SERIES_INTRADAY";
            break;
        case TimeSeriesEnum.MONTHLY:
            timeSeriesToken = "TIME_SERIES_MONTHLY";
            break;
        case TimeSeriesEnum.WEEKLY:
            timeSeriesToken = "TIME_SERIES_WEEKLY";
            break;
        default:
            timeSeriesToken = "TIME_SERIES_DAILY";
            break;
    }


    var url = `https://www.alphavantage.co/query?function=${timeSeriesToken}&symbol=${stockToken}&apikey=${API_KEY}`;

    return new Promise((resolve, reject) => {
        var http = new XMLHttpRequest();
        http.open("GET", url);
        http.onload = () => resolve(http.responseText);
        http.onerror = () => reject(http.statusText);
        http.send();
    });
}

function getJsonTimeSeriesIndicator(timeSeries){
    var timeSeriesJSONIndicator;
    switch (timeSeries) {
        case TimeSeriesEnum.DAILY:
            timeSeriesJSONIndicator = "Time Series (Daily)";
            break;
        case TimeSeriesEnum.INTRADAY:
            timeSeriesJSONIndicator = "Time Series (15min)";
            break;
        case TimeSeriesEnum.MONTHLY:
            timeSeriesJSONIndicator = "Monthly Time Series";
            break;
        case TimeSeriesEnum.WEEKLY:
            timeSeriesJSONIndicator = "Weekly Time Series";
            break;
        default:
            timeSeriesJSONIndicator = "Time Series (Daily)";
            break;
    }
    return timeSeriesJSONIndicator;
}
var TimeSeriesEnum = {
    INTRADAY: 1,
    DAILY: 2,
    WEEKLY: 3,
    MONTHLY: 4,
    BATCH: 5
};

const API_KEY = "YGFY7TCSV5V6I7JN";

function requestStockData(stockTokens, timeSeries){
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
        case TimeSeriesEnum.BATCH:
            timeSeriesToken = "BATCH_STOCK_QUOTES";
            break;
        default:
            timeSeriesToken = "TIME_SERIES_DAILY";
            break;
    }

    var symbolOrSymbols;
    var stockTokenString = "";
    if (Array.isArray(stockTokens)){
        for (var token in stockTokens)
            stockTokenString = stockTokenString + stockTokens[token] + ",";
        stockTokenString = stockTokenString.substring(0, stockTokenString.length - 1);
        symbolOrSymbols = "symbols";
    } else {
        stockTokenString = stockTokens;
        symbolOrSymbols = "symbol";
    }

    var url = "https://www.alphavantage.co/query?function=${timeSeriesToken}&${symbolOrSymbols}=${stockTokenString}&apikey=${API_KEY}";

    return new Promise((resolve, reject) => {
        var http = new XMLHttpRequest();
    http.open("GET", url);
    http.onload = () => resolve(http.responseText);
    http.onerror = () => reject(http.statusText);
    http.send();
});
}

function getJsonTimeSeriesIndicator(timeSeries){
    switch (timeSeries) {
        case TimeSeriesEnum.BATCH:
            return "Stock Quotes";
        case TimeSeriesEnum.DAILY:
            return "Time Series (Daily)";
        case TimeSeriesEnum.INTRADAY:
            return "Time Series (15min)";
        case TimeSeriesEnum.MONTHLY:
            return "Monthly Time Series";
        case TimeSeriesEnum.WEEKLY:
            return "Weekly Time Series";
            break;
        default:
            return "Time Series (Daily)";
    }
}

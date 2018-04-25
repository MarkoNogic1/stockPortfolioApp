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
        this.stocks = [];
        for (var stockIndex in _stocks){
            this.stocks.push(new Stock(_stocks[stockIndex],0,0,0,0));
        }
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
//-------------- User Data Variables -----------------------------------
var userData = undefined;
var stockTokens = [];


//This function pulls the user's data from the database,
//hits the Alpha Vantage API for the values,
//then loads the values back into the database
function getUserPortfolioData() {
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        xhttp.open("GET", "/getUserPortfolioData", true);
        xhttp.onload = function () {
            if (this.readyState === 4 && this.status === 200) {
                var jsonResponse = this.response;

                var sectors = [];
                stockTokens = ""; //for ALL sectors

                for (var sector in jsonResponse) {
                    stockTokens += jsonResponse[sector]["stocks"] + ",";
                    var stocks = jsonResponse[sector]["stocks"].split(",");
                    var sector = new Sector(jsonResponse[sector]["sectorname"], stocks);
                    sectors.push(sector);
                }
                stockTokens = stockTokens.split(",");
                userData = new UserPortfolioData(sectors);

                var summaryTimeSeries = TimeSeriesEnum.BATCH;
                var summaryTimeSeriesIndicator = getJsonTimeSeriesIndicator(summaryTimeSeries);
                requestStockData(stockTokens, summaryTimeSeries).then(function(response){
                    var stockData = JSON.parse(response);

                    /*for (var key in stockData[summaryTimeSeriesIndicator]) {
                        summaryData.push([stockData[summaryTimeSeriesIndicator][key]["1. symbol"], parseFloat(stockData[summaryTimeSeriesIndicator][key]["2. price"])]);
                    }*/
                    for (var key in stockData[summaryTimeSeriesIndicator]) {
                        var http = new XMLHttpRequest();
                        http.open("POST", "/updateStockValue");
                        http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        const body = '{"stockName":"'+stockData[summaryTimeSeriesIndicator][key]["1. symbol"] + '", "stockValue":"' + parseFloat(stockData[summaryTimeSeriesIndicator][key]["2. price"]).toFixed(2) + '"}';
                        http.send(body);
                    }
                });
            }
        };
        xhttp.send();
    });
}






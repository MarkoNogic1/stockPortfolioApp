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

var userData;
var stockTokens = [];
var summaryData = [['Stock Token', 'Current Value']];

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






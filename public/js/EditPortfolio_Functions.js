getUserPortfolioData();

function submit_ADD()
{
    var stockname = String(document.getElementsByName("StockName")[0].value);

    requestStockData(stockname, TimeSeriesEnum.Batch).then(function(Dummy){
        if(Dummy.length > 152)
        {
            document.getElementById('addStockForm').submit();
        }
        else
        {
            alert("Stock Name Must be Valid");
        }

    })
        .catch(function(error){
            alert("Stock Name Must be Valid");
        });
    /*
    if(valid)
    {
        document.getElementById('addStockForm').submit();
    }*/

}

function submit_REMOVE()
{
    document.getElementById('removal_form').submit();
}

function submit_EDIT()
{
    valid = true;
    //INSERT STUFF HERE FOR CHECKING VALUES
    if(valid)
    {
        document.getElementById('edit_form').submit();
    }
}

function addOptions()
{

    /*var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        // do something with jsonResponse
    };
    req.send(null);*/

    var xhttp = new XMLHttpRequest();

    xhttp.responseType = 'json';

    xhttp.onreadystatechange = function(){
        var select1 = document.getElementById("StockSelector1");
        var select2 = document.getElementById("StockSelector2");
        if (this.readyState === 4 && this.status === 200)
        {
            var jsonResponse = this.response;

            for(var i = 0; i<jsonResponse.length; ++i)
            {
                var opt = document.createElement('option');
                var opt2 = document.createElement('option');
                var stock = jsonResponse[i].stockname;

                opt.value = String(stock);
                opt.innerHTML = String(stock);
                opt2.value = String(stock);
                opt2.innerHTML = String(stock);

                select1.appendChild(opt);
                select2.appendChild(opt2);
            }

                /*
                if (StockName !== undefined && StockName !== 'undefined' && StockName !== 'null' && StockName !== null && StockName !== '')
                {
                    var opt = document.createElement('option');
                    var opt2 = document.createElement('option');

                    opt.value = StockName;
                    opt.innerHTML = StockName;
                    opt2.value = StockName;
                    opt2.innerHTML = StockName;

                    select1.appendChild(opt);
                    select2.appendChild(opt2);
                }*/


        }

    };

    xhttp.open("GET", "/getPortfolioData", true);
    xhttp.send();

}

$(document).ready(function(){
    $('#navTabs').click(function(){
        getUserPortfolioData();
    })
});
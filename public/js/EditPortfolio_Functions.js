
function submit_ADD()
{
    valid = true;
    //INSERT STUFF HERE FOR CHECKING VALUES
    if(valid)
    {
        document.getElementById('addStockForm').submit();
    }

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

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        var select1 = document.getElementById("StockSelector1");
        var select2 = document.getElementById("StockSelector2");
        if (this.readyState === 4 && this.status === 200 && this.responseText !== 'null')
        {
            var longstring = this.responseText;
            //confirm(longstring);
            var stocks  = longstring.split("&");
            //confirm(stocks[0]);

            for (var index = 0; index < stocks.length; ++index)
            {
                //confirm("New Item");
                var values = stocks[index].split("^");

                var StockID = values[0];
                var StockName = values[1];

                //confirm("Values");
                //confirm(values[0]);
                //confirm(values[1]);
                if (StockName !== undefined && StockName !== 'undefined' && StockName !== 'null' && StockName !== null && StockName !== '')
                {
                    var opt = document.createElement('option');
                    var opt2 = document.createElement('option');

                    opt.value = StockID;
                    opt.innerHTML = StockName;
                    opt2.value = StockID;
                    opt2.innerHTML = StockName;

                    select1.appendChild(opt);
                    select2.appendChild(opt2);
                }

            }
        }

    };

    xhttp.open("GET", "/getPortfolioData", true);
    xhttp.send();

}
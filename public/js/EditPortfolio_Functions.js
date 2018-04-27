getUserPortfolioData();

function submit_ADD()
{
    var stockname = String(document.getElementsByName("StockName")[0].value);

    requestStockData(stockname, TimeSeriesEnum.Batch).then(function(Dummy){
        if(Dummy.length > 152)
        {
            var xhttp = new XMLHttpRequest();

            xhttp.responseType = 'json';

            xhttp.onreadystatechange = function()
            {
                var inputSector = document.getElementById("SectorNameList");
                var sectornames = [];
                //var duplicate = false;


                if (this.readyState === 4 && this.status === 200)
                {
                    var jsonResponse = this.response;

                    //Build list of sectors
                    for(var i = 0; i<jsonResponse.length; ++i)
                    {
                        var sector = String(jsonResponse[i].sectorname);

                        if(sectornames.includes(sector) === false)
                        {
                            sectornames.push(sector);
                        }

                    }

                    //Check if exists
                    for(i = 0; i<sectornames.length; ++i)
                    {
                        //alert(inputSector.value);
                        if(sectornames[i].toUpperCase() === inputSector.value.toUpperCase())
                        {
                            inputSector.value = sectornames[i];
                            break
                        }
                    }

                    document.getElementById('addStockForm').submit();

                }

            };

            xhttp.open("GET", "/getPortfolioData", true);
            xhttp.send();

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
        var sectorSelect = document.getElementById("SectorName");
        var sectorSelect2 = document.getElementById("EditSector");

        var sectornames = [];

        if (this.readyState === 4 && this.status === 200)
        {
            var jsonResponse = this.response;

            //GOING THROUGH JSON RESPONSE TO BUILD STOCK LIST AND BUILD ARRAY OF SECTOR NAMES
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

                var sector = String(jsonResponse[i].sectorname);
                if(sectornames.includes(sector) === false)
                {
                    sectornames.push(sector);
                }
            }

            //APPLYING ALL UNIQUE SECTOR NAMES
            for(i = 0; i<sectornames.length; ++i)
            {
                var opt3 = document.createElement('option');
                var opt4 = document.createElement('option');

                opt3.value = sectornames[i];
                opt4.value = sectornames[i];

                sectorSelect.appendChild(opt3);
                sectorSelect2.appendChild(opt4);
            }

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
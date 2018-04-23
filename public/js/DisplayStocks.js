function myFunction()
{
    //What to do:
    //XMLrequest for the database's string.
    //Break it apart and call the function for each entry.
    var xhttp = new XMLHttpRequest();

    xhttp.responseType = 'json'; //Sets response type into json

    //What to do when the data is ready.
    xhttp.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200)
        {

            var response = this.response;

            var answer = formatResponse(response);

            if (answer !== "" && answer !== null)
            {
                var tableRef = document.getElementById('stockinfo');

                for (var i = 0; i < answer.length; i++)
                {
                    var newRow = tableRef.insertRow(tableRef.rows.length);
                    var stockCell = newRow.insertCell(0);
                    var numCell = newRow.insertCell(1);
                    var secCell = newRow.insertCell(2);
                    var dateCell = newRow.insertCell(3);
                    var valueCell = newRow.insertCell(4);

                    var nameInfo = document.createTextNode(answer[i][0]);
                    var numInfo = document.createTextNode(answer[i][1]);
                    var secInfo = document.createTextNode(answer[i][2]);
                    var dateInfo = document.createTextNode(answer[i][3]);
                    var valueInfo = document.createTextNode(answer[i][4]);

                    stockCell.appendChild(nameInfo);
                    numCell.appendChild(numInfo);
                    secCell.appendChild(secInfo);
                    dateCell.appendChild(dateInfo);
                    valueCell.appendChild(valueInfo);
                }
            }

        }


    };

    xhttp.open( "GET", "/getPortfolioData", true);
    xhttp.send();

}

/*
HERE IS THE FORMATTING
*/
function formatResponse(resp)
{
  var result = [];
  var firform = resp;
  for (var index = 0; index < firform.length; ++index)
  {
    var finalform = [];
    // id = newform[0];
    // stockName = newform[1];
    // numOfShares = newform[2];
    // sector = newform[3];
    // dataAcquired = newform[4];
    //We don't need iD for the stock
    finalform.push(firform[index].stockname, firform[index].sharesnumber, firform[index].sectorname, firform[index].dateaquired, firform[index].stockvalue);
    result.push(finalform);
  }
  return result;
}

myFunction();

window.onload = function genLinks(){
  var refTable = document.getElementById('stockinfo');
  stocklinkssection = document.createElement('div');
  stocklinkssection.className = "col-lg-12";

  theheader = document.createElement('h1');
  theheader.className = "page-header";
  theheader.innerHTML = "Stock Links";
  stocklinkssection.appendChild(theheader);

  //alert(document.getElementById('stockinfo').rows.length);
  for (var i = 1; i < refTable.rows.length; i++)
  {
    //gets cells of current row
   var oCells = refTable.rows.item(i).cells;

   a = document.createElement('a');
   a.href = "https://www.google.com/search?q=stock+" + oCells[0].innerHTML;
   a.innerHTML = oCells[0].innerHTML;

   newp = document.createElement('p');
   newp.appendChild(a);

   stocklinkssection.appendChild(newp);

  }
  document.getElementById('rowdiv').appendChild(stocklinkssection);
}

function myFunction() {
  //What to do:
  //XMLrequest for the database's string.
  //Break it apart and call the function for each entry.
  var xhttp = new XMLHttpRequest();
  xhttp.open( "GET", "/getPortfolioData", false);
  xhttp.send();
  response = xhttp.responseText
  var answer = formatResponse(response);
  //What to do when the data is ready.
  /*xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200 && this.responseText !== undefined && this.responseText !== 'undefined' && this.responseText !== 'null' && this.responseText !== null && this.responseText !== '')
    {
      var longstring = this.responseText;
    }
  }
  */
  if (answer != "" && answer != null)
  {
    var tableRef = document.getElementById('stockinfo');
    for (var i = 0; i < answer.length; i++)
    {
      var newRow   = tableRef.insertRow(tableRef.rows.length);
      var stockCell  = newRow.insertCell(0);
      var numCell = newRow.insertCell(1);
      var secCell = newRow.insertCell(2);
      var dateCell = newRow.insertCell(3);
      var nameInfo  = document.createTextNode(answer[i][1]);
      var numInfo  = document.createTextNode(answer[i][2]);
      var secInfo  = document.createTextNode(answer[i][3]);
      var dateInfo  = document.createTextNode(answer[i][4]);
      stockCell.appendChild(nameInfo);
      numCell.appendChild(numInfo);
      secCell.appendChild(secInfo);
      dateCell.appendChild(dateInfo);
    }
  }

}

function formatResponse(resp)
{
  var result = [];
  var firform = resp.split("&");
  for (var index = 0; index < firform.length-1; index++)
  {
    var newform = firform[index].split("^");
    var finalform = [];
    // id = newform[0];
    // stockName = newform[1];
    // numOfShares = newform[2];
    // sector = newform[3];
    // dataAcquired = newform[4];
    //We don't need iD for the stock
    finalform.push(newform[0], newform[1], newform[2], newform[3], newform[4]);
    result.push(finalform);
  }
  return result;
}

myFunction();

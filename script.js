// Function for PUT request
function createPUTRequest(connToken, jsonObj, dbName, relName) {
  var putRequest =
    "{\n" +
    '"token" : "' +
    connToken +
    '",' +
    '"dbName": "' +
    dbName +
    '",\n' +
    '"cmd" : "PUT",\n' +
    '"rel" : "' +
    relName +
    '",' +
    '"jsonStr": \n' +
    jsonObj +
    "\n" +
    "}";
  return putRequest;
}

// Function for command execution synchronously
function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
  var url = dbBaseUrl + apiEndPointUrl;
  var jsonObj;
  $.post(url, reqString, function (result) {
    jsonObj = JSON.parse(result);
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    jsonObj = JSON.parse(dataJsonObj);
  });
  return jsonObj;
}

// setting up configuration
var studentToken = "90935021|-31949211575688821|90959345";
var studentDB = "SCHOOL-DB";
var studentRel = "STUDENT-TABLE";
var studentBaseUrl = "http://api.login2explore.com:5577";

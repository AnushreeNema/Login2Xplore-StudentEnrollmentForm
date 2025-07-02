// setting up configuration
var studentToken = "90935021|-31949211575688821|90959345";
var studentDB = "SCHOOL-DB";
var studentRel = "STUDENT-TABLE";
var studentBaseUrl = "http://api.login2explore.com:5577";

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
// resetting
function resetStudentForm() {
  $(
    "#rollInput, #nameInput, #classInput, #dobInput, #addressInput, #enrollInput"
  ).val("");
  $("#rollInput").prop("disabled", false).focus();
  $(
    "#nameInput, #classInput, #dobInput, #addressInput, #enrollInput, #saveBtn, #editBtn"
  ).prop("disabled", true);
  $("#resetBtn").prop("disabled", true);
}

// validation
function validateStudentForm() {
  if (!$("#rollInput").val()) return $("#rollInput").focus(), "";
  if (!$("#nameInput").val()) return $("#nameInput").focus(), "";
  if (!$("#classInput").val()) return $("#classInput").focus(), "";
  if (!$("#dobInput").val()) return $("#dobInput").focus(), "";
  if (!$("#addressInput").val()) return $("#addressInput").focus(), "";
  if (!$("#enrollInput").val()) return $("#enrollInput").focus(), "";

  var jsonStr = {
    Roll_No: $("#rollInput").val(),
    Full_Name: $("#nameInput").val(),
    Class: $("#classInput").val(),
    Birth_Date: $("#dobInput").val(),
    Address: $("#addressInput").val(),
    Enrollment_Date: $("#enrollInput").val(),
  };

  return JSON.stringify(jsonStr);
}
// checking if roll no. exists and updating the state of form
function checkStudentRecord(ele) {
  var roll = ele.value;
  var getReq = {
    token: studentToken,
    cmd: "GET_BY_KEY",
    dbName: studentDB,
    rel: studentRel,
    jsonStr: { Roll_No: roll },
    createTime: false,
    updateTime: false,
  };
  var req = JSON.stringify(getReq);

  jQuery.ajaxSetup({ async: false });
  var res = executeCommand(req, studentBaseUrl, "/api/irl");
  jQuery.ajaxSetup({ async: true });

  if (res.status === 400) {
    $(
      "#nameInput, #classInput, #dobInput, #addressInput, #enrollInput, #saveBtn, #resetBtn"
    ).prop("disabled", false);
    $("#nameInput").focus();
  } else {
    var record = JSON.parse(res.data).record;
    $("#nameInput").val(record.Full_Name);
    $("#classInput").val(record.Class);
    $("#dobInput").val(record.Birth_Date);
    $("#addressInput").val(record.Address);
    $("#enrollInput").val(record.Enrollment_Date);

    $("#rollInput").prop("disabled", true);
    $(
      "#nameInput, #classInput, #dobInput, #addressInput, #enrollInput, #editBtn, #resetBtn"
    ).prop("disabled", false);
    $("#saveBtn").prop("disabled", true);
  }
}

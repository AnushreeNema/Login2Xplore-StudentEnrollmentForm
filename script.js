// setting up Configuration
const token = "90935021|-31949211575688821|90959345";
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";
const baseUrl = "http://api.login2explore.com:5577";

// resetting form function
function resetForm() {
  $("#studentForm input").val("");
  $("#roll").prop("disabled", false).focus();
  $("#name, #cls, #dob, #addr, #doe").prop("disabled", true);
  $("#save, #update, #reset").prop("disabled", true);
}

// validation of fields
function validateForm() {
  const roll = $("#roll").val().trim();
  const name = $("#name").val().trim();
  const cls = $("#cls").val().trim();
  const dob = $("#dob").val().trim();
  const addr = $("#addr").val().trim();
  const doe = $("#doe").val().trim();

  if (!roll) return $("#roll").focus(), "";
  if (!name) return $("#name").focus(), "";
  if (!cls) return $("#cls").focus(), "";
  if (!dob) return $("#dob").focus(), "";
  if (!addr) return $("#addr").focus(), "";
  if (!doe) return $("#doe").focus(), "";

  return JSON.stringify({
    Roll_No: roll,
    Full_Name: name,
    Class: cls,
    Birth_Date: dob,
    Address: addr,
    Enrollment_Date: doe,
  });
}

function executeCommand(reqString, endpoint) {
  let result = "";
  $.ajax({
    url: baseUrl + endpoint,
    type: "POST",
    data: reqString,
    async: false,
    dataType: "json",
    success: function (res) {
      result = res;
    },
    error: function (err) {
      result = JSON.parse(err.responseText);
    },
  });
  return result;
}

// PUT command
function createPUTRequest(token, jsonStr, dbName, relName) {
  return JSON.stringify({
    token: token,
    cmd: "PUT",
    dbName: dbName,
    rel: relName,
    jsonStr: JSON.parse(jsonStr),
  });
}

function checkRoll() {
  const rollVal = $("#roll").val().trim();
  if (!rollVal) return;

  const req = JSON.stringify({
    token: token,
    cmd: "GET_BY_KEY",
    dbName: dbName,
    rel: relName,
    jsonStr: { Roll_No: rollVal },
  });

  const res = executeCommand(req, "/api/irl");

  if (res.status === 400) {
    $("#name, #cls, #dob, #addr, #doe").prop("disabled", false);
    $("#save, #reset").prop("disabled", false);
    $("#update").prop("disabled", true);
    $("#name").focus();
  } else if (res.status === 200) {
    try {
      const parsed = JSON.parse(res.data);
      const record = parsed.record;

      $("#name").val(record.Full_Name);
      $("#cls").val(record.Class);
      $("#dob").val(record.Birth_Date);
      $("#addr").val(record.Address);
      $("#doe").val(record.Enrollment_Date);

      $("#roll").prop("disabled", true);
      $("#name, #cls, #dob, #addr, #doe").prop("disabled", false);
      $("#update, #reset").prop("disabled", false);
      $("#save").prop("disabled", true);
      $("#name").focus();
    } catch (err) {
      alert("Failed to parse server data.");
    }
  } else {
    alert("Unexpected server response.");
  }
}

// function for saving student record
function saveData() {
  const jsonStr = validateForm();
  if (jsonStr === "") return;

  const req = createPUTRequest(token, jsonStr, dbName, relName);
  const res = executeCommand(req, "/api/iml");

  alert("Record saved successfully.");
  resetForm();
}

// updating student record
function updateData() {
  const jsonStr = validateForm();
  if (jsonStr === "") return;

  const req = JSON.stringify({
    token: token,
    cmd: "SET",
    dbName: dbName,
    rel: relName,
    type: "UPDATE",
    primaryKey: "Roll_No",
    jsonStr: JSON.parse(jsonStr),
  });

  const res = executeCommand(req, "/api/iml/set");

  alert("Record updated successfully.");
  resetForm();
}

$(document).ready(() => {
  resetForm();
});

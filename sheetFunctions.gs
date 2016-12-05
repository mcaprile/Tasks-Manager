var thisSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var thisSpreadsheetID = thisSpreadsheet.getId();
var activeSS = thisSpreadsheet.getActiveSheet();

function onEdit() {   
  TasksManagerSheetScripts.unStatuses(thisSpreadsheetID,activeSS);  
  TasksManagerSheetScripts.rStatuses(thisSpreadsheetID);
  TasksManagerSheetScripts.copyDD(thisSpreadsheetID,activeSS);
}

function onOpen() {
  TasksManagerSheetScripts.copyMaster(thisSpreadsheetID);
  TasksManagerSheetScripts.rStatuses(thisSpreadsheetID);
  TasksManagerSheetScripts.unStatuses(thisSpreadsheetID,activeSS);
  TasksManagerSheetScripts.newEntries(thisSpreadsheetID,activeSS);
}

function onFormSubmit() { 
  TasksManagerSheetScripts.newEntries(thisSpreadsheetID,activeSS);
  TasksManagerSheetScripts.copyMaster(thisSpreadsheetID);
}

function onChange() {
  TasksManagerSheetScripts.rStatuses(thisSpreadsheetID);
}

function inTheMorning() {
  TasksManagerSheetScripts.autoLate(thisSpreadsheetID);
  Notifications.dailyTasks(thisSpreadsheetID, "https://docs.google.com/spreadsheets/d/1UUIFF6WCGF36Grvjf6bqSGoYEnAVlNUCgkF4XHNY8RI/edit#gid=478491336");
  Notifications.lateNotifications(thisSpreadsheetID);
}

function monthly() {
  TasksManagerSheetScripts.resetID(thisSpreadsheetID);
}

function atNight() {
  Notifications.compTasks(thisSpreadsheetID);
}
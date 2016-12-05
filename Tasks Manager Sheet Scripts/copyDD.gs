function copyDD(spreadsheetID,activeSS) {
  //copy and paste results from due date filter so that the results are not editable
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var as = activeSS;
  
  if (as.getName() == "Due Date Filter") {
    var ddSheet = ss.getSheetByName("Due Date Filter");
    var ddRange = ddSheet.getRange("S2:AF");
    
    ddRange.copyTo(ddSheet.getRange(2, 1), {contentsOnly:true});
  }
}

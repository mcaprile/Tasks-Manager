function resetID(spreadsheetID) {
  //reset the project count values at the beginning of the month
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var demoSheet = ss.getSheetByName("Demo Values");
  
  var values = [["1"],["1"],["1"]];
  demoSheet.getRange(1,16,3,1).setValues(values);
}

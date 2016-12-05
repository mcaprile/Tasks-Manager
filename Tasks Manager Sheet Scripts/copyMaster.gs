function copyMaster(spreadsheetID) {
  //copy the master sheet into the 'Sort Sheet'
  var ss = SpreadsheetApp.openById(spreadsheetID);
  
  var masSheet = ss.getSheetByName("Master");
  var masRange = masSheet.getRange("A:N");
  
  var sortSheet = ss.getSheetByName("Sort Sheet");

  sortSheet.clearContents(); //clear the contents of the sort sheet
  masRange.copyTo(sortSheet.getRange(1, 1), {contentsOnly:true}); //only copy the contents of the master sheet (not the formatting)
}
function autoLate(spreadsheetID) {
  //Labels late tasks as 'Late'
  var ss = SpreadsheetApp.openById(spreadsheetID);
  
  var mSheet = ss.getSheetByName("Master");
  var mDDValues = mSheet.getRange("G2:G").getValues(); //master sheet due dates values
  var mStatusValues = mSheet.getRange("N2:N").getValues(); //master sheet status values
  
  var today = new Date(); 
  
  for (var i = 0; i < mDDValues.length; i++) { // loop through due date values
    var sDate = new Date(mDDValues[i][0]); //current due date
    var st = mStatusValues[i]; //matching status value
    
    //if the due date year is less than today's year, and the status is not 'Complete' - mark as 'Late'
    if (sDate.getFullYear() < today.getFullYear() && st != "Complete") {
        mSheet.getRange(i + 2, 12).setValue("Late");
      }
    //if the due date month is less than today's month, the due date year is less than or equal to today's year, and the status is not 'Complete' - mark as 'Late'
    else if (sDate.getMonth() < today.getMonth() && 
      sDate.getFullYear() <= today.getFullYear() && st != "Complete") { 
        mSheet.getRange(i + 2, 12).setValue("Late");
      }
    //if the due date month is equal to today's month, the due date year is less than or equal to today's year, 
    //the due date day is less than today's day, and the status is not 'Complete' - mark as 'Late'
    else if (sDate.getMonth() == today.getMonth() && 
      sDate.getFullYear() <= today.getFullYear() && sDate.getDate() < today.getDate() && st != "Complete") {
        mSheet.getRange(i + 2, 12).setValue("Late");
      }
  }
  
  
}
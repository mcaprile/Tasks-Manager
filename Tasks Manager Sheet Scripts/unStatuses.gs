function timeCompleted(ms) {  
  //places time completed timestamp
  var masValues = ms.getRange("A2:N").getValues();
  
  for (var row in masValues) {
    if (masValues[row][13] != "Complete" && masValues[row][2] != "") { //if the task status is not complete and the timestamp cell is not blank, set it to blank
      var num = parseInt(row) + 2;
      ms.getRange(num, 3).setValue("");
      ms.getRange(num, 13).setValue("");
    }
    else if (masValues[row][13] == "Complete" && masValues[row][2] == "") { //if the task status is 'complete' and the timestamp cell is blank, place a timestamp
      var num = parseInt(row) + 2;
      var time = new Date();
      var timeText = Utilities.formatDate(time, "MST", "MM/dd/yyyy hh:mm:ss aa");
      ms.getRange(num, 3).setValue(timeText);
    }
  }
}

function unStatuses(spreadsheetID,activeSS) {
  //update master sheet with updated statuses and update staff tables with new statuses
  
  var ss2 = SpreadsheetApp.openById(spreadsheetID);
  var masSheet = ss2.getSheetByName("Master");
  var masDataRange = masSheet.getSheetValues(2, 1, -1, 14);
  var stSheet = ss2.getSheetByName("Staff Member Tasks");
  var stDataRange = stSheet.getSheetValues(3, 1, -1, -1);
  var demoSheet = ss2.getSheetByName("Demo Values");
  var demoSheetDataRange = demoSheet.getSheetValues(1, 1, 3, 4);
  
  
  timeCompleted(masSheet);
  
  function stMem(sName,stPlace,sDR,sh) {
    this.name = sName; //staff member name
    this.stCol = ((stPlace*11) + 11); //status column for staff member
    this.allIDs = []; //array of task IDs for staff member tasks
    this.allStats = []; //array of statuses for staff member tasks
    this.allTHt = []; //array of "TH taken" for staff member tasks
    this.catSheet = sh; //sheet with this staff member's tasks
    
    for (var c = 0; c < sDR.length; c++) {
      var ids = sDR[c][stPlace*11]; 
      var stats = sDR[c][(stPlace*11)+10];
      var thtak = sDR[c][(stPlace*11)+9];
      if (ids != "") {this.allIDs.push(ids); this.allStats.push(stats);this.allTHt.push(thtak);}
    }
  }
  
  var person1 = new stMem(demoSheetDataRange[0][1],0,stDataRange,stSheet);
  var person2 = new stMem(demoSheetDataRange[1][1],1,stDataRange,stSheet);
  var person3 = new stMem(demoSheetDataRange[2][1],2,stDataRange,stSheet);
  
  var stMems = [person1,person2,person3]; //array of staff members with tasks data
  
  var ss = activeSS;
  
  for (var r = 0; r < masDataRange.length; r++) {
    var taskID = masDataRange[r][0]; //task ID
    var staffM = masDataRange[r][10]; //staff member task is assigned to
    var mStat = masDataRange[r][13]; //status in the master sheet that corresponds to the task
    
    for (var k = 0; k < stMems.length; k++) {  
      var stObj = stMems[k]; //the current staff member
      if (staffM.toString() === stObj.name) {
        var m = stObj.allIDs.indexOf(taskID); //checks if the current staff member owns this task ID
        var n = stObj.allStats.indexOf("-"); //checks if any of the statuses are "-"
        var entry = stObj.allStats[m]; //the status in the tasks table that corresponds to the task ID (if it exists)
        var allTH = stObj.allTHt[m]; //the "th taken" indicated in the tasks table that corresponds to the task ID (if it exists)
        
        if (m != (-1) && mStat != entry) { //if the task ID belongs to the current staff member and the status in the master sheet doesn't match the one in the individual tasks table
          if (ss.getName() == "Staff Member Tasks") {   //if the active sheet contains task tables
            if (entry != "Assigned" && n == (-1)) {  //if the task does not have the "assigned" status in the tasks table or "-"
              if (entry == "Complete" && allTH == "") { //if the task status in the tasks table is "complete" and "th taken" is not indicated
                stObj.catSheet.getRange(m + 3, stObj.stCol, 1).setValue("Update TH taken");} //notify that "th taken" needs to be updated
              else if (entry == "Complete" && allTH != "") { //if the task status in the tasks table is "complete" and "th taken" is indicated
                masSheet.getRange(r + 2, 13, 1, 2).setValues([[allTH,entry]]); //update the master sheet with the complete status and "th taken" for it
                stObj.catSheet.getRange(m + 3, stObj.stCol-1, 1, 2).setValues([["","-"]]); //erase the "th taken" and replace the status with "-" (it will be removed with rStatuses())
                timeCompleted(masSheet); rStatuses();} //place a completed task timestamp and re-order the statuses
              else if (entry != "" && entry != "Update TH taken") {masSheet.getRange(r + 2, 14, 1).setValue(entry);} //if status isn't blank and is not "update TH taken", update the master sheet with the status
            }
          }
          
          else if (mStat == "Assigned" || mStat == "Ongoing"){ //if the status in the master sheet is "Assigned" or "Ongoing"
            timeCompleted(masSheet);
            stObj.catSheet.getRange(m + 3, stObj.stCol, 1).setValue(mStat); //update the staff member tasks table that contains the status
          }
        }
        break;
      }
    }
  }
}
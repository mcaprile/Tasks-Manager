function rStatuses(spreadsheetID) {
  //reorder statuses after order change
  
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var masSheet = ss.getSheetByName("Master");
  var masDataRange = masSheet.getSheetValues(2, 1, -1, 14);
  var stSheet = ss.getSheetByName("Staff Member Tasks");
  var stDataRange = stSheet.getSheetValues(3, 1, -1, -1); 
  var demoSheet = ss.getSheetByName("Demo Values");
  var demoSheetDataRange = demoSheet.getSheetValues(1, 1, 3, 4)
  
  function stMem(sName,stPlace,sDR,sh) {
    this.name = sName; //staff member name
    this.stCol = ((stPlace*11) + 11); //status column for staff member student
    this.allIDs = []; //array of task IDs for staff member student tasks
    this.allStats = []; //array of statuses for staff member student tasks
    this.allTHtaks = []; //array of "TH taken" for staff member student tasks
    this.catSheet = sh; //sheet with this staff member's tasks
    this.pRange = [] //tasks table for this staff member
    
    //collect given staff member task IDs, statuses, and "th taken"
    for (var c = 0; c < sDR.length; c++) {
      //every staff member tasks table is 11 columns long
      var ids = sDR[c][stPlace*11]; 
      var stats = sDR[c][(stPlace*11)+10];
      var thtaks = sDR[c][(stPlace*11)+9];

      if (ids != "" && ids !="#N/A") {this.allIDs.push(ids);}
      //if (stats != "") {this.allStats.push(stats);}
      if (stats != "") {this.allStats.push(c);}
      if (thtaks != "" ) {this.allTHtaks.push(c)}; //if there is a "th taken" found, record it's row position in the tasks table
      if (ids.length > 0 || stats.length > 0 || thtaks.length > 0) {this.pRange[c] = sDR[c].slice((stPlace*11),this.stCol);}
    }
    
  } 
  
  //creating staff member objects with properties
  var person1 = new stMem(demoSheetDataRange[0][1],0,stDataRange,stSheet);
  var person2 = new stMem(demoSheetDataRange[1][1],1,stDataRange,stSheet);
  var person3 = new stMem(demoSheetDataRange[2][1],2,stDataRange,stSheet);
  
  var stMems = [person1,person2,person3]; //array of staff members with tasks data
  
  function reOrder(stObj,masDR) { //updates task table statuses based on what the master sheet has
    for (var l = 0; l < masDR.length; l++) { 
      var n = stObj.allIDs.indexOf(masDR[l][0]);
      
      if (n != (-1)) {
        var entry2 = masDR[l][13];
        stObj.catSheet.getRange(n + 3, stObj.stCol, 1).setValue(entry2);
      }
    }
  }
  
  
  for (var r = 0; r < stMems.length; r++) { 
    var staffM = stMems[r];
    var thl = staffM.allTHtaks.length - 1; //used to locate the last value in the "th taken" array for this staff member
    var stl = staffM.allStats.length - 1; //used to locate the last value in the "th taken" array for this staff member
    //if (staffM.allIDs.length < staffM.allStats.length) { //if there more statuses in the tasks table than IDs
    if (staffM.allIDs.length < (staffM.allStats[stl] + 1)) { //if there more statuses in the tasks table than IDs
      var entry = "";
      //staffM.catSheet.getRange(((staffM.allStats.length-1) + 3), staffM.stCol, 1).setValue(entry); //erase the extra status
      staffM.catSheet.getRange((staffM.allStats[stl] + 3), staffM.stCol, 1).setValue(entry);
      
      reOrder(staffM,masDataRange); //match the task statuses with what the master sheet has
    }
    if (staffM.allIDs.length < (staffM.allTHtaks[thl] + 1)) { //if there is a "th taken" indicated after the last row with a task, it should be erased
      
      var entry = "";
      staffM.catSheet.getRange((staffM.allTHtaks[thl] + 3), (staffM.stCol - 1), 1).setValue(entry);
      
      reOrder(staffM,masDataRange); //match the task statuses with what the master sheet has
    }
    else if (staffM.allIDs.length > staffM.allStats.length) { //if there are more IDs than statuses, there is a status missing
      reOrder(staffM,masDataRange); //match the task statuses with what the master sheet has
    }
  }
}

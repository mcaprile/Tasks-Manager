function newEntries(spreadsheetID,activeSS) {
  //assign task IDs to submitted tasks
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var masSheet = ss.getSheetByName("Master");
  var masdataRange = masSheet.getSheetValues(2, 1, -1, 12);
  var demoSheet = ss.getSheetByName("Demo Values");
  var demoSheetDataRange = demoSheet.getSheetValues(1, 11, 3, 6)
  
  var countValues = masSheet.getRange("P1:P3").getValues(); //get count values for different projects
  var cValues = [demoSheetDataRange[0][5],demoSheetDataRange[1][5],demoSheetDataRange[2][5]]; //count values are the first item of countValues range array
  
  function project(pName,abbr,place,cVs,row) {
    this.name = pName; //project name
    this.bc = cVs[place]; //the count value in the slot for this project
    this.row = row; //row number with the project's count value
    this.abbre = abbr; //project abbreviation
  }
  
  //creating project objects with properties
  var proj1 = new project(demoSheetDataRange[0][1],"'Demo Values'!N1",0,cValues,1);
  var proj2 = new project(demoSheetDataRange[1][1],"'Demo Values'!N2",1,cValues,2);
  var proj3 = new project(demoSheetDataRange[2][1],"'Demo Values'!N3",2,cValues,3);
  
  var projs = [proj1,proj2,proj3]; //array of projects
  
  for (var row = 0; row < masdataRange.length; row++) { //loop through tasks in master sheet
    var proj = masdataRange[row][3]; //task project
    
    if (proj != "" && masdataRange[row][0] == "") { //if the task project is not blank and the task ID slot is blank
      for (var i = 0; i < projs.length; i++) { //loop through array of projects
        var projN = projs[i]; //current project object
        if (projN.name == proj.toString()) { //if the current object's project name is the same as the task project name
          
          var abb = ""; //task ID project abbreviation
          var today = new Date(); 
          var projCount = 0;
          var rowNum; //column containing project count
          
          abb = projN.abbre;
          projCount = projN.bc;
          rowNum = projN.row;
          
          var id = masSheet.getRange(row + 2, 1); //the task ID cell for current task
          
          //place task ID which includes the project abbreviation, today's month, today's year, and the current project count
          var numID = '"' + (today.getMonth() + 1) + (today.getFullYear().toString().substr(2,2)) + '","-","' + ("00" + projCount).slice (-3);
          id.setFormula("=CONCATENATE(" + abb + "," + numID +'")'); 
          projCount++; //increase the current project's count by one
          demoSheet.getRange(rowNum,16).setValue(projCount); //update the project count
          updateReference(spreadsheetID);
          unStatuses(spreadsheetID,activeSS); //place the new task in the corresponding task box for the staff member
          Notifications.newNotification(spreadsheetID,"https://docs.google.com/spreadsheets/d/1UUIFF6WCGF36Grvjf6bqSGoYEnAVlNUCgkF4XHNY8RI/edit#gid=478491336"); //send staff member a new task notification
          break;
        }
      }
    }
  }
}
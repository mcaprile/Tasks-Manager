function newNotification(spreadsheetID,staffSheetLink) {
  //e-mail notification of new task
  var ss = SpreadsheetApp.openById(spreadsheetID);

  var masSheet = ss.getSheetByName("Master");
  var masLastRow = masSheet.getRange(masSheet.getLastRow(), 1, 1, 14).getValues();
  var mLR = masLastRow[0]; //get last task submitted in master sheet
  var demoSheet = ss.getSheetByName("Demo Values");
  var demoSheetDataRange = demoSheet.getSheetValues(1, 1, 3, 4)
  
  //array of staff members
  var staffList = [[demoSheetDataRange[0][1],demoSheetDataRange[0][3]],[demoSheetDataRange[1][1],demoSheetDataRange[1][3]],[demoSheetDataRange[2][1],demoSheetDataRange[2][3]]];
  
  for (var a = 0; a < staffList.length; a++) { //loop through array of staff members
    
    var sName = staffList[a][0].toString(); //current staff member name
    var em = staffList[a][1].toString(); //current staff member e-mail
    var staffM = mLR[10]; //the staff member latest task is assigned to
    var status = mLR[13]; //latest task status
    
    //if current staff member name match the latest task and status is 'Assigned' or 'Ongoing'
    if (staffM === sName && (status == "Assigned" || status == "Ongoing")) {
      var priority = mLR[11]; //new task priority level
      var assigner = mLR[9]; //assigner of new task
      var proj = mLR[3]; //project new task belongs to
      var tID = mLR[0]; //new task ID
      var task = mLR[4]; //new task description
      var due = new Date(mLR[6]); //new task due date
      var dueText = Utilities.formatDate(due, "MST", "MM/dd/yyyy"); //new task due date formatted as text
      if (mLR[5] != "") { //if the start date field is not blank
        var startT = new Date(mLR[5]); //task due date 
        var startText = Utilities.formatDate(startT, "MST", "MM/dd/yyyy"); //task due date formatted as text 
      }
      else if (mLR[5] == "") { //if the start date field is blank
        var startText = ""; //leave entry for start date blank
      }
      
      //line with new task
      var newTask = "<tr><td>" + tID + "</td><td>" + proj + "</td><td>" + startText + "</td><td>" + dueText + "</td><td>" + task + "</td><td>" + assigner + "</td><td>" + priority + "</td><td>" + status + "</td></tr>";
      
      //send new task notification e-mail
      MailApp.sendEmail({to: em,subject: "New " + proj + " Task",name: "Tasks Manager", replyTo: 'mcaprile@asu.edu', htmlBody: "You have been assigned a <a href='" + staffSheetLink + "'>new task</a>: <br><br><table><tr style='font-weight:bold;'><td style='width: 90px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 100px;'>Start Date</td><td style='width: 100px;'>Due Date</td><td style='width: 400px;'>Task</td><td style='width: 140px;'>Assigned By</td><td style='width: 90px;'>Priority</td><td style='width: 90px;'>Status</td></tr><tr><td>" + newTask + "</td></tr></table>"});
      
    }
  }
}
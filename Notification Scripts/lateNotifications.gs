function lateNotifications(spreadsheetID) {
  
  //sends e-mail notification of late project tasks
  
  var ss = SpreadsheetApp.openById(spreadsheetID);
  
  //call master sheet
  var masSheet = ss.getSheetByName("Master");
  var masDataRange = masSheet.getSheetValues(2, 1, -1, 14); 
  var demoSheet = ss.getSheetByName("Demo Values");
  var demoSheetDataRange = demoSheet.getSheetValues(1, 7, 3, 4)
  
  // create array of assigners
  var assiList = [[demoSheetDataRange[0][1],demoSheetDataRange[0][3]],[demoSheetDataRange[1][1],demoSheetDataRange[1][3]],[demoSheetDataRange[2][1],demoSheetDataRange[2][3]]];
  
  for (var a = 0; a < assiList.length; a++) { //loop through assigner array
    var aName = assiList[a][0].toString(); //current assigner name
    var em = assiList[a][1].toString(); //assigner e-mail
    var aUpdate = new Array(); //array of late tasks
    
    for (var i = 0; i < masDataRange.length; i++) { // repeat loop
      var priority = masDataRange[i][11]; //task priority level
      var assigner = masDataRange[i][9]; //task assigner
      var proj = masDataRange[i][3]; //task project
      var tID = masDataRange[i][0]; //task ID
      var task = masDataRange[i][4]; //task description
      var staffM = masDataRange[i][10]; //staff member task is assigned tp
      var status = masDataRange[i][13]; //task status
      var hpw = masDataRange[i][7]; //min hpw
      var eth = masDataRange[i][8]; //ETH
      if (masDataRange[i][5] != "") { //if the start date field is not blank
        var startT = new Date(masDataRange[i][5]); //task due date 
        var startText = Utilities.formatDate(startT, "MST", "MM/dd/yyyy"); //task due date formatted as text 
      }
      else if (masDataRange[i][5] == "") { //if the start date field is blank
        var startText = ""; //leave entry for start date blank
      }
      var due = new Date(masDataRange[i][6]); //task due date
      var dueText = Utilities.formatDate(due, "MST", "MM/dd/yyyy"); //task due date formatted as text
      
      //line created for current task
      var lateTask = "<tr><td>" + tID + "</td><td>" + proj + "</td><td>" + startText + "</td><td>" + dueText + "</td><td>" + task + "</td><td>" + staffM + "</td><td>" + hpw + "</td><td>" + eth + "</td><td>" + status + "</td></tr>";
      
      //if the current assigner matches the task assigner, the task priority level is 'Late', and the task is not 'Complete' - add current task to array of late tasks
      if ((assigner.toString().search(aName) != (-1)) && priority == "Late" && status != "Complete") {aUpdate.push(lateTask);}
      
    }
    
    //if quantity of late tasks is greater than zero, send e-mail
    if (aUpdate.length > 0) {
      MailApp.sendEmail({to: em,subject: "Late Tasks (" + aUpdate.length + ")",htmlBody: "Late tasks for all projects: <br><span style='font-style:italic; font-size:11px;'>You can change the 'Late' status by changing the due date and editing the priority level using the <a href='https://docs.google.com/forms/d/1iO_nnc_QeV2dFoIt-cGdiwXxalOFEXEl4bJAqtFhRso/viewform'>task editing form</a>.</span><br><br><table><tr style='font-weight:bold;'><td style='width: 90px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 100px;'>Start Date</td><td style='width: 100px;'>Due Date</td><td style='width: 420px;'>Task</td><td style='width: 100px;'>Assigned To</td><td style='width: 70px;'>Min hpw</td><td style='width: 50px;'>ETH</td><td style='width: 110px;'>Status</td></tr><tr><td>" + aUpdate.join("") + "</td></tr></table>"});
    }
    
    
  }
}
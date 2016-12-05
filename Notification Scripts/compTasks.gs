function compTasks(spreadsheetID) {
  
  // sends e-mail notification of completed tasks
  
  var ss = SpreadsheetApp.openById(spreadsheetID);
  
  // call Master sheet
  var masSheet = ss.getSheetByName("Master");
  var masDataRange = masSheet.getSheetValues(2, 1, -1, 14);  
  var demoSheet = ss.getSheetByName("Demo Values");
  var demoSheetDataRange = demoSheet.getSheetValues(1, 7, 3, 4)
  
  // create array of assigners  
  var assiList = [[demoSheetDataRange[0][1],demoSheetDataRange[0][3]],[demoSheetDataRange[1][1],demoSheetDataRange[1][3]],[demoSheetDataRange[2][1],demoSheetDataRange[2][3]]];
 
  var today = new Date();
  var yest = new Date();
  yest.setDate(yest.getDate() - 1);  
  
  for (var a = 0; a < assiList.length; a++) {
    var aName = assiList[a][0].toString(); // assigner's name
    var em = assiList[a][1].toString(); // assigner's e-mail
    
    var aCompleted = new Array(); // array that will contain completed tasks
    
    for (var i = 0; i < masDataRange.length; i++) { // going through tasks in master sheet
      var assigner = masDataRange[i][9]; //task assigners
      var dcomp = new Date(masDataRange[i][2]);    // date completed
      
      // if the current assigner's name is listed in the task assigner box and the date the task was completed is between yesterday at 8pm and today ay 8pm (8pm is the time of the trigger)
      if ((assigner.toString().search(aName) != (-1)) && (dcomp > yest) && (dcomp <= today)) {
        var priority = masDataRange[i][11]; //task priority level
        var proj = masDataRange[i][3]; //task project
        var tID = masDataRange[i][0]; //task ID
        var task = masDataRange[i][4]; //task description
        var staffM = masDataRange[i][10]; //staff task is assigned to
        var status = masDataRange[i][13]; //status of the task
        var due = new Date(masDataRange[i][6]); //due date of the task
        var thtaken = masDataRange[i][12]; //total hours taken for the task
        var eth = masDataRange[i][8]; //estimated total hours
        var compText = Utilities.formatDate(dcomp, "MST", "MM/dd/yyyy hh:mm a"); //date completed formatted as text
        var dueText = Utilities.formatDate(due, "MST", "MM/dd/yyyy"); //task due date formatted as text
        
        var line = new Array(); //line created for current task
        
        line.push(tID,proj,dueText,task,staffM,compText,priority,eth,thtaken);
        aCompleted.push(line.join("</td><td>"));} //push the line in the array of completed tasks
      
    }
    
    var aTitle = "Completed Tasks Today (" + aCompleted.length + ")"; // e-mail subject
    
    //if the array of completed tasks is more than zero, send e-mail
    if (aCompleted.length > 0) {
      MailApp.sendEmail({to: em, subject: aTitle, htmlBody: "Tasks completed today: <br><br><table><tr style='font-weight:bold;'><td style='width: 110px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 80px;'>Due Date</td><td style='width: 400px;'>Task</td><td style='width: 110px;'>Assigned To</td><td style='width:100px;'>Time Completed</td><td style='width:60px;'>Priority</td><td style='width:40px;'>ETH</td><td style='width:100px;'>TH taken</td></tr><tr><td>" + aCompleted.join("</td></tr><tr><td>") + "</td></tr></table>"});
    }
    
    
  }
}
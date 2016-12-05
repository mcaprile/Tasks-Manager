function dailyTasks(spreadsheetID,staffSheetLink) {
  //sends e-mail daily with task lists for staff members
  var ss = SpreadsheetApp.openById(spreadsheetID);
  
  //call master sheet
  var compSheet = ss.getSheetByName("Master");
  var compDataRange = compSheet.getSheetValues(2, 1, -1, 14); 
  var demoSheet = ss.getSheetByName("Demo Values");
  var demoSheetDataRange = demoSheet.getSheetValues(1, 1, 3, 4)
  
  //create array of staff members and graduate students
  var staffList = [[demoSheetDataRange[0][1],demoSheetDataRange[0][3]],[demoSheetDataRange[1][1],demoSheetDataRange[1][3]],[demoSheetDataRange[2][1],demoSheetDataRange[2][3]]];
  
  for (var s = 0; s < staffList.length; s++) { //loop through array of staff members
    
    var staffN = staffList[s][0].toString(); //current staff member
    var em = staffList[s][1].toString(); //staff member e-mail
    
    //e-mail notification of SIBS completed tasks
    var mAssigned = new Array(); //array of tasks with status 'Assigned'
    var mReceived = new Array(); //array of tasks with status 'Received'
    var mInProgress = new Array(); //array of tasks with status 'In Progress (x%)'
    var mOngoing = new Array(); //array of tasks with status 'Ongoing'
    var mPendingR = new Array(); //array of tasks with status 'Pending Review'
    
    for (var i = 0; i < compDataRange.length; i++) { // repeat loop
      var priority = compDataRange[i][11]; //task priority level
      var assigner = compDataRange[i][9]; //task assigner
      var proj = compDataRange[i][3]; //task project
      var tID = compDataRange[i][0]; //task ID
      var task = compDataRange[i][4]; //task description
      var staffM = compDataRange[i][10]; //staff member or graduate student task is assigned tp
      var status = compDataRange[i][13]; //task status
      var due = new Date(compDataRange[i][6]); //task due date
      
      var line = new Array(); //line created for current task
      
      var dueText = Utilities.formatDate(due, "MST", "MM/dd/yyyy"); //task due date formatted as text
      
      line.push(tID,proj,dueText,task,assigner,priority);
      
      if (staffM === staffN) { //if the current staff member name matches the task staff member name
        
        //adds task to the arrays of different statuses based on task status
        if (status == "Assigned") {
          mAssigned.push(line.join("</td><td>"));
        }
        else if (status == "Received") {
          mReceived.push(line.join("</td><td>"));
        }
        else if (status.toString().search("In progress") != -1) {
          mInProgress.push(line.join("</td><td>"));
        }
        else if (status.toString().search("Pending review") != -1) {
          mPendingR.push(line.join("</td><td>"));
        }
        else if (status.toString().search("Ongoing") != -1) {
          mOngoing.push(line.join("</td><td>"));
        }
      }
    }
    
    function dailyTL(ma,mr,mip,mpr,mo) {
      this.mas = ""; //tasks assigned
      this.mrs = ""; //tasks received
      this.mips = ""; //tasks in progress
      this.mprs = ""; //tasks pending review
      this.mos = ""; //tasks ongoing
      this.alltsks;
      
      //display task tables for different statuses if tasks with that status exist
      if (ma.length > 0) {
        this.mas = "<u>Assigned</u> - <br><br><table><tr style='font-weight:bold;'><td style='width: 90px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 100px;'>Due Date</td><td style='width: 400px;'>Task</td><td style='width: 100px;'>Assigned By</td><td style='width:80px;'>Priority</td></tr><tr><td>" + ma.join("</td></tr><tr><td>") + "</td></tr></table><br><br>"; }
      if (mr.length > 0) {
        this.mrs = "<u>Received</u> - <br><br><table><tr style='font-weight:bold;'><td style='width: 90px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 100px;'>Due Date</td><td style='width: 400px;'>Task</td><td style='width: 100px;'>Assigned By</td><td style='width:80px;'>Priority</td></tr><tr><td>" + mr.join("</td></tr><tr><td>") + "</td></tr></table><br><br>"; }
      if (mip.length > 0) {
        this.mips = "<u>In progress</u> - <br><br><table><tr style='font-weight:bold;'><td style='width: 90px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 100px;'>Due Date</td><td style='width: 400px;'>Task</td><td style='width: 100px;'>Assigned By</td><td style='width:80px;'>Priority</td></tr><tr><td>" + mip.join("</td></tr><tr><td>") +  "</td></tr></table><br><br>";}
      if (mpr.length > 0) {
        this.mprs = "<u>Pending review</u> - <br><br><table><tr style='font-weight:bold;'><td style='width: 90px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 100px;'>Due Date</td><td style='width: 400px;'>Task</td><td style='width: 100px;'>Assigned By</td><td style='width:80px;'>Priority</td></tr><tr><td>" + mpr.join("</td></tr><tr><td>") + "</td></tr></table><br><br>";}
      if (mo.length > 0) {
        this.mos = "<u>Ongoing</u> - <br><br><table><tr style='font-weight:bold;'><td style='width: 90px;'>Task ID</td><td style='width: 80px;'>Project</td><td style='width: 100px;'>Due Date</td><td style='width: 400px;'>Task</td><td style='width: 100px;'>Assigned By</td><td style='width:80px;'>Priority</td></tr><tr><td>" + mo.join("</td></tr><tr><td>") + "</td></tr></table>";}
      
      this.alltsks = this.mas + this.mrs + this.mips + this.mprs + this.mos; //combine task tables
      return this.alltsks;
    }
    
    var title = "Tasks (" + (mAssigned.length + mReceived.length + mInProgress.length + mPendingR.length + mOngoing.length) + ")"; //e-mail subject
    
    //if tasks exist for this staff member, send e-mail
    if ((mAssigned.length + mReceived.length + mInProgress.length + mPendingR.length  + mOngoing.length) > 0) {
      var allTasks = dailyTL(mAssigned,mReceived,mInProgress,mPendingR,mOngoing);
      MailApp.sendEmail({to: em, subject: title, name: "Tasks Manager", replyTo: 'mcaprile@asu.edu', htmlBody: "<a href='" + staffSheetLink + "'>Tasks to be completed:</a> <br><br>" + allTasks });
    }
    
  }
  lateNotifications(spreadsheetID); //trigger late tasks notification
}
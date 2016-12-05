Project page can be found here: http://michellece.com/Projects/

Demo sheet: https://docs.google.com/spreadsheets/d/1UUIFF6WCGF36Grvjf6bqSGoYEnAVlNUCgkF4XHNY8RI/edit?usp=sharing

Position: Management Intern for the Latino Resilience Enterprise at Arizona State University

Created: July 2014

Context:

I was asked to create a sheet that was shareable in order to keep track of tasks assigned to different staff members and graduate students because the department had recently gotten bigger. They originally had Excel in mind, and I chose to go with Google Sheets so that people could edit it at the same time. Then, while constructing the sheet I wanted to explore creating a more interactive experience which resulted in a tasks management system based in Google Apps Script, using Google Sheets and Forms.

Instructions for demo:

I adapted the tasks manager to present a demo. The staff, assigner, and project names will be updated with the custom value submissions of each new person, though they will be cleared at the end of every day.

You can update the sheet with custom person and project information using this form: https://goo.gl/forms/hy0y8lSxTCbd10fi1

	* By providing e-mail addresses you will be able to preview e-mail notifications when you perform different tasks.
 

The tasks submission form is here (it will updated with the custom values you submitted, otherwise it will have default values): https://goo.gl/forms/Bd6nnOzxkoDGxoH23

	* Use that form to assign tasks. Once submitted, the person that the task was assigned to will get a new task notification (at the e-mail you provided for that person). Their tasks table will be updated and they will be able to update their progress levels there. Any updates they make will reflect on the master sheet. When they select “complete”, the entry will be cleared from their tasks table completely. In the original tasks manager directors would get an e-mail at the end of the day listing the completed tasks for the day (if there were any). They preferred to get one e-mail instead of being updated about each individual task that was completed.
 

I prepared the following documents that PIs (Principal Investigators – the persons who assigned the tasks) and staff members used as reference:

	* tasks-manager-handout (http://michellece.com/wp-content/uploads/2016/12/TASKS-MANAGER-HANDOUT-2.pdf)
	* tasks-manager-guide (http://michellece.com/wp-content/uploads/2016/12/TASKS-MANAGER-GUIDE.pdf)
 

You can use the following form to manually reset the values you entered or trigger the non-automatic notifications (completed tasks, late tasks, and daily tasks list): https://goo.gl/forms/zaJr4hSQt8wPDkdL2

Future plans:

	* Review and optimize code – haven’t worked with it since summer 2015 and it was created in a way catered to a specific amount of people.
	* Since creating the tasks manager I created forms that allowed staff members to reverse tasks that were marked as “complete”, and a form that assigners could use to edit tasks. I intend to integrate those into the demo soon.
	* Develop it beyond a demo into something that can be used and easily adapted by others.

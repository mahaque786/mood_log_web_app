// Google Apps Script Code for Mood Log Web App
// 
// Instructions:
// 1. Open your Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Copy this entire code and paste it into the Apps Script editor
// 4. Save the project
// 5. Deploy as a Web App (Deploy > New deployment > Web app)
// 6. Set "Execute as" to "Me" and "Who has access" to "Anyone"
// 7. Copy the Web App URL and use it in the web app configuration

function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Append a new row with the data
    sheet.appendRow([
      data.timestamp,
      data.date,
      data.name,
      data.mood,
      data.energy,
      data.sleep,
      data.stress,
      data.activities,
      data.notes
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'data': data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to set up the sheet with proper headers
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Check if headers already exist
  if (sheet.getRange(1, 1).getValue() !== '') {
    var response = Browser.msgBox(
      'Headers Already Exist',
      'The sheet already has data in the first row. Do you want to replace it?',
      Browser.Buttons.YES_NO
    );
    
    if (response !== 'yes') {
      return;
    }
  }
  
  // Set up headers
  var headers = [
    'Timestamp',
    'Date',
    'Name',
    'Mood',
    'Energy Level',
    'Hours of Sleep',
    'Stress Level',
    'Activities',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format the header row
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#667eea')
    .setFontColor('#ffffff');
  
  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Freeze the header row
  sheet.setFrozenRows(1);
  
  Browser.msgBox('Setup Complete', 'The sheet has been set up with proper headers!', Browser.Buttons.OK);
}

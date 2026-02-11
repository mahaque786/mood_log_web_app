# Mood Log Web App 🌟

A simple, beautiful web application to track your daily mood and emotional wellbeing. Built with vanilla HTML, CSS, and JavaScript, and designed to work with Google Sheets for data storage.

## Features

- 📊 **Mood Tracking**: Log your daily mood with emoji-based selections
- ⚡ **Energy & Stress Levels**: Track energy and stress on a 1-10 scale
- 😴 **Sleep Tracking**: Record hours of sleep
- 🏃 **Activity Logging**: Track daily activities (exercise, meditation, social time, etc.)
- 📝 **Notes**: Add personal notes about your day
- 📈 **Google Sheets Integration**: All data is stored in a Google Sheet for easy analysis
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Demo

Visit the live app at: `https://mahaque786.github.io/mood_log_web_app/`

## Setup Instructions

### 1. Fork and Enable GitHub Pages

1. Fork this repository to your GitHub account
2. Go to Settings → Pages
3. Under "Source", select the branch you want to deploy (usually `main` or `copilot/build-github-pages-app`)
4. Click "Save"
5. Your app will be available at `https://YOUR_USERNAME.github.io/mood_log_web_app/`

### 2. Set Up Google Sheets Integration

#### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Mood Log Data"
3. In the first row, add these column headers:
   - Timestamp
   - Date
   - Name
   - Mood
   - Energy Level
   - Hours of Sleep
   - Stress Level
   - Activities
   - Notes

#### Step 2: Create a Google Apps Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any code in the editor and paste the following script:

```javascript
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
```

3. Click **Save** (disk icon)
4. Click **Deploy** → **New deployment**
5. Click the gear icon next to "Select type" and choose **Web app**
6. Configure the deployment:
   - Description: "Mood Log Web App"
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/...../exec`)
9. Click **Authorize access** and grant the necessary permissions

#### Step 3: Configure the Web App

1. Open your deployed mood log web app in a browser
2. Open the browser's Developer Console (F12 or Right-click → Inspect → Console)
3. Run this command (replace with your actual Google Apps Script URL):

```javascript
configureMoodLog("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec")
```

4. You should see a success message: "✅ Google Apps Script URL configured successfully!"

## Usage

1. Open the web app in your browser
2. Fill out the mood questionnaire:
   - Select the date (defaults to today)
   - Optionally enter your name
   - Choose your mood using the emoji buttons
   - Adjust energy and stress levels using the sliders
   - Enter hours of sleep
   - Check any activities you did today
   - Add any additional notes
3. Click "Submit Mood Log"
4. Your data will be sent to your Google Sheet!

## Customization

### Changing Questions

Edit `index.html` to modify the questionnaire fields.

### Styling

Edit `styles.css` to customize the appearance of the app.

### Adding New Features

Edit `script.js` to add new functionality.

## Data Privacy

- All your mood data is stored in YOUR Google Sheet
- You have complete control over your data
- No third-party services are used
- The app stores the Google Apps Script URL in your browser's localStorage

## Troubleshooting

### Submission Not Working?

1. Check that you've configured the Google Apps Script URL (see Step 3 above)
2. Make sure your Google Apps Script is deployed with "Anyone" access
3. Check the browser console for any error messages
4. Verify that your Google Sheet has the correct column headers

### Clear Configuration

To reset the Google Apps Script URL, run in the browser console:
```javascript
localStorage.removeItem('googleScriptUrl')
```

## Technologies Used

- HTML5
- CSS3 (with modern features like gradients and transitions)
- Vanilla JavaScript (ES6+)
- Google Apps Script
- Google Sheets API

## Contributing

Feel free to submit issues or pull requests to improve the app!

## License

MIT License - feel free to use this for personal or educational purposes.
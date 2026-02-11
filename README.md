# Mental Health Tracking Web App 🧠

> **⚠️ IMPORTANT DISCLAIMER**: This application is for symptom tracking purposes only and does NOT replace professional medical advice, diagnosis, or treatment. Always consult with a qualified mental health professional for clinical decisions. If you're experiencing a mental health crisis, contact emergency services or a crisis hotline immediately (US: 988 Suicide & Crisis Lifeline).

A clinical-grade web application for daily mental health symptom tracking. Built with vanilla HTML, CSS, and JavaScript, and designed to work with Google Sheets for data storage via Google Apps Script.

## Features

- 📊 **Clinical Questionnaires**: Standardized mental health assessment scales
  - **PHQ-4**: Depression and anxiety screening (Section A)
  - **Executive Function**: ADHD-related focus and task initiation (Section B)
  - **Sleep & Energy**: Sleep quality and energy levels (Section C)
  - **ASRM**: Mania/hypomania screening (Section D)
  - **Side Effects**: Medication side effect tracking (Section E)
  - **Safety Assessment**: Thoughts of self-harm screening (Section F)
- 📝 **Notes & Triggers**: Log daily observations and triggers
- 📈 **Google Sheets Integration**: All data is stored in a Google Sheet for easy analysis
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Privacy**: Data stored in your own Google Sheet

## Demo

Visit the live app at: `https://mahaque786.github.io/mood_log_web_app/`

## Quick Start

The app is pre-configured with a Google Apps Script URL. Simply:
1. Visit the deployed GitHub Pages site
2. Fill out your daily check-in
3. Click "Submit Daily Check-in"
4. Your data will be sent to the configured Google Sheet

## Setup Instructions

### 1. Fork and Enable GitHub Pages

1. Fork this repository to your GitHub account
2. Go to Settings → Pages
3. Under "Source", select the branch you want to deploy (usually `main` or `copilot/build-github-pages-app`)
4. Click "Save"
5. Your app will be available at `https://YOUR_USERNAME.github.io/mood_log_web_app/`

### 2. (Optional) Set Up Your Own Google Sheets Integration

If you want to use your own Google Sheet instead of the pre-configured one:

#### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Mental Health Tracking"
3. In the first row, add these column headers (in order):
   - Timestamp
   - Date
   - A1 Depressed (0-3)
   - A2 Interest (0-3)
   - A3 Anxious (0-3)
   - A4 Worry (0-3)
   - B5 Focus (0-10)
   - B6 Task Start (0-10)
   - B7 Function (0-10)
   - C8 Sleep Hrs
   - C9 Sleep Qual (0-10)
   - C10 Energy (0-10)
   - D11 Wired (0-10)
   - D12 Less Sleep (0-10)
   - D ASRM Total (0-20)
   - E13 SE Freq (0-6)
   - E14 SE Intensity (0-6)
   - E15 SE Burden (0-6)
   - F16 Safety (0-3)
   - Notes/Triggers

#### Step 2: Create a Google Apps Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any code in the editor and paste the following script:

```javascript
// CONFIGURATION
var SHEET_NAME = "Sheet1"; // Make sure this matches your tab name exactly

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Auto-generate Timestamp
    var timestamp = new Date();
    var dateStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd");
    
    // Map the incoming data to your specific columns
    var newRow = [
      timestamp,                               // Timestamp
      data.date || dateStr,                    // Date
      data.a1_depressed || "",                 // A1 Depressed (0-3)
      data.a2_interest || "",                  // A2 Interest (0-3)
      data.a3_anxious || "",                   // A3 Anxious (0-3)
      data.a4_worry || "",                     // A4 Worry (0-3)
      data.b5_focus || "",                     // B5 Focus (0-10)
      data.b6_task_start || "",                // B6 Task Start (0-10)
      data.b7_function || "",                  // B7 Function (0-10)
      data.c8_sleep_hrs || "",                 // C8 Sleep Hrs
      data.c9_sleep_qual || "",                // C9 Sleep Qual (0-10)
      data.c10_energy || "",                   // C10 Energy (0-10)
      data.d11_wired || "",                    // D11 Wired (0-10)
      data.d12_less_sleep || "",               // D12 Less Sleep (0-10)
      data.d_asrm_total || "",                 // D ASRM Total (0-20)
      data.e13_se_freq || "",                  // E13 SE Freq (0-6)
      data.e14_se_intensity || "",             // E14 SE Intensity (0-6)
      data.e15_se_burden || "",                // E15 SE Burden (0-6)
      data.f16_safety || "",                   // F16 Safety (0-3)
      data.notes || ""                         // Notes/Triggers
    ];

    // Append the row
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success", 
      "message": "Row added successfully",
      "row": sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error", 
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (disk icon)
4. Click **Deploy** → **New deployment**
5. Click the gear icon next to "Select type" and choose **Web app**
6. Configure the deployment:
   - Description: "Mental Health Tracking"
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. Copy the **Web app URL**
9. Click **Authorize access** and grant the necessary permissions

#### Step 3: Configure the Web App

To use your own Google Apps Script URL:

1. Open your deployed mental health tracking app in a browser
2. Open the browser's Developer Console (F12 or Right-click → Inspect → Console)
3. Run this command (replace with your actual Google Apps Script URL):

```javascript
configureMoodLog("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec")
```

4. You should see a success message: "✅ Google Apps Script URL configured successfully!"

## Usage

### Daily Check-in Process

1. **Section A: Mood & Anxiety (PHQ-4)**
   - Rate how often you've experienced depression and anxiety symptoms over the last 2 weeks
   - Scale: 0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day

2. **Section B: Focus & Function**
   - Rate your current difficulty with focus, task initiation, and overall function
   - Scale: 0 = No difficulty, 10 = Extreme difficulty

3. **Section C: Sleep & Energy**
   - Enter hours of sleep and rate sleep quality and energy levels
   - Scales: 0-24 hours for sleep, 0-10 for quality/energy

4. **Section D: Elevated Mood (ASRM)**
   - Assess symptoms of mania or hypomania
   - Scale: 0 = Not at all, 10 = Extremely

5. **Section E: Medication Side Effects**
   - If taking medication, rate frequency, intensity, and burden of side effects
   - Scale: 0 = None, 6 = Severe

6. **Section F: Safety**
   - **IMPORTANT**: Assess thoughts of self-harm or harm to others
   - Scale: 0 = Not at all, 3 = Very much/Frequently
   - ⚠️ If experiencing thoughts of self-harm, contact a mental health professional or crisis hotline immediately (US: 988)

7. **Notes & Triggers**
   - Add any notable events, triggers, medication changes, or observations

8. Click **"Submit Daily Check-in"** to save your data

## Understanding the Assessment Scales

### PHQ-4 (Section A)
- **PHQ-2** (A1-A2): Depression screening
- **GAD-2** (A3-A4): Anxiety screening
- Total score interpretation:
  - 0-2: Minimal symptoms
  - 3-5: Mild symptoms
  - 6-8: Moderate symptoms
  - 9-12: Severe symptoms

### ASRM (Section D)
- Altman Self-Rating Mania Scale
- Scores ≥6 may indicate manic or hypomanic symptoms

## Data Privacy

- All your mental health data is stored in YOUR Google Sheet
- You have complete control over your data
- No third-party services access your information
- The app stores the Google Apps Script URL in your browser's localStorage

## Customization

### Changing the Default Google Apps Script URL

If you're deploying this for others and want to change the default Google Apps Script URL in the code:

1. Edit `script.js`
2. Find the `getScriptUrl()` function
3. Replace the URL in the return statement with your Google Apps Script URL

### Styling

Edit `styles.css` to customize the appearance of the app.

## Troubleshooting

### Submission Not Working?

1. Check that the Google Apps Script URL is configured correctly
2. Make sure your Google Apps Script is deployed with "Anyone" access
3. Check the browser console for any error messages
4. Verify that your Google Sheet has the correct column headers
5. Try disabling browser extensions (ad blockers can sometimes interfere)

### Clear Configuration

To reset the Google Apps Script URL, run in the browser console:
```javascript
localStorage.removeItem('googleScriptUrl')
```

## Clinical Use

This app uses standardized screening tools that are commonly used in clinical settings:
- **PHQ-4**: Brief depression and anxiety screening
- **ASRM**: Mania screening scale
- **Custom executive function assessment**: For ADHD symptom tracking

**Disclaimer**: This tool is for tracking purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified mental health professional.

## Technologies Used

- HTML5
- CSS3 (with modern features like gradients and transitions)
- Vanilla JavaScript (ES6+)
- Google Apps Script
- Google Sheets API

## Contributing

Feel free to submit issues or pull requests to improve the app!

## License

MIT License - feel free to use this for personal, educational, or clinical purposes.

## Crisis Resources

If you or someone you know is experiencing thoughts of self-harm:
- **US**: 988 Suicide & Crisis Lifeline
- **International**: Find resources at [findahelpline.com](https://findahelpline.com)
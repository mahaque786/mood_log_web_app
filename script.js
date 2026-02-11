// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today; // Prevent future dates

    // Update range input displays
    const energyInput = document.getElementById('energy');
    const energyValue = document.getElementById('energyValue');
    energyInput.addEventListener('input', function() {
        energyValue.textContent = this.value;
    });

    const stressInput = document.getElementById('stress');
    const stressValue = document.getElementById('stressValue');
    stressInput.addEventListener('input', function() {
        stressValue.textContent = this.value;
    });

    // Handle form submission
    const form = document.getElementById('moodForm');
    form.addEventListener('submit', handleSubmit);
});

async function handleSubmit(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('.submit-btn');
    const messageDiv = document.getElementById('message');

    // Disable submit button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Hide previous messages
    messageDiv.classList.remove('show', 'success', 'error');

    try {
        // Collect form data
        const formData = collectFormData(event.target);

        // Send data to Google Sheets (via Google Apps Script)
        await sendToGoogleSheets(formData);

        // Show success message
        showMessage('✅ Mood log submitted successfully!', 'success');

        // Reset form after successful submission
        event.target.reset();
        
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        
        // Reset range values
        document.getElementById('energyValue').textContent = '5';
        document.getElementById('stressValue').textContent = '5';

    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('❌ Error submitting mood log. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Mood Log';
    }
}

function collectFormData(form) {
    const formData = new FormData(form);
    const data = {
        timestamp: new Date().toISOString(),
        date: formData.get('date'),
        name: formData.get('name') || 'Anonymous',
        mood: formData.get('mood'),
        energy: formData.get('energy'),
        sleep: formData.get('sleep'),
        stress: formData.get('stress'),
        activities: formData.getAll('activities').join(', '),
        notes: formData.get('notes') || ''
    };

    return data;
}

async function sendToGoogleSheets(data) {
    // Get the Google Apps Script Web App URL from a configuration
    // Users should replace this with their own Google Apps Script Web App URL
    const SCRIPT_URL = getScriptUrl();

    if (!SCRIPT_URL || SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        console.warn('Google Apps Script URL not configured. Data would be:', data);
        // For demo purposes, simulate a successful submission
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script cross-origin requests
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    // Note: With no-cors mode, we cannot read the response body
    // Google Apps Script returns JSON with success/error status, but it's not accessible
    // We assume success if no error is thrown during the fetch operation
    return response;
}

function getScriptUrl() {
    // Check if URL is stored in localStorage (for user configuration)
    const storedUrl = localStorage.getItem('googleScriptUrl');
    if (storedUrl) {
        return storedUrl;
    }

    // Default placeholder URL - users should update this
    // To configure, open browser console and run:
    // localStorage.setItem('googleScriptUrl', 'YOUR_ACTUAL_URL')
    return 'YOUR_GOOGLE_APPS_SCRIPT_URL';
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.classList.add('show', type);

    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

// Allow users to configure the Google Apps Script URL via console
window.configureMoodLog = function(scriptUrl) {
    if (!scriptUrl) {
        console.error('Please provide a Google Apps Script URL');
        return;
    }
    localStorage.setItem('googleScriptUrl', scriptUrl);
    console.log('✅ Google Apps Script URL configured successfully!');
    console.log('You can now submit mood logs to your Google Sheet.');
};

// Show configuration instructions on load
console.log('🌟 Mood Log Web App');
console.log('To connect to your Google Sheet, run:');
console.log('configureMoodLog("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL")');

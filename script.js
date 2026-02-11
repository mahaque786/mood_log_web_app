// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today; // Prevent future dates

    // Setup all range input displays
    setupRangeInput('b5_focus');
    setupRangeInput('b6_task_start');
    setupRangeInput('b7_function');
    setupRangeInput('c9_sleep_qual');
    setupRangeInput('c10_energy');
    setupRangeInput('d11_wired');
    setupRangeInput('d12_less_sleep');
    setupRangeInput('e13_se_freq');
    setupRangeInput('e14_se_intensity');
    setupRangeInput('e15_se_burden');

    // Handle form submission
    const form = document.getElementById('moodForm');
    form.addEventListener('submit', handleSubmit);
});

function setupRangeInput(inputId) {
    const input = document.getElementById(inputId);
    const valueDisplay = document.getElementById(inputId + '_value');
    
    if (!input || !valueDisplay) {
        console.warn(`Range input setup failed: Could not find elements for "${inputId}"`);
        return;
    }
    
    input.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
    });
}

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
        showMessage('✅ Check-in submitted successfully!', 'success');

        // Reset form after successful submission
        event.target.reset();
        
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        
        // Reset range values to their defaults
        resetRangeInput('b5_focus', 5);
        resetRangeInput('b6_task_start', 5);
        resetRangeInput('b7_function', 5);
        resetRangeInput('c9_sleep_qual', 5);
        resetRangeInput('c10_energy', 5);
        resetRangeInput('d11_wired', 0);
        resetRangeInput('d12_less_sleep', 0);
        resetRangeInput('e13_se_freq', 0);
        resetRangeInput('e14_se_intensity', 0);
        resetRangeInput('e15_se_burden', 0);

    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('❌ Error submitting check-in. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Daily Check-in';
    }
}

function resetRangeInput(inputId, defaultValue) {
    const input = document.getElementById(inputId);
    const valueDisplay = document.getElementById(inputId + '_value');
    
    if (input && valueDisplay) {
        input.value = defaultValue;
        valueDisplay.textContent = defaultValue;
    }
}

function collectFormData(form) {
    const formData = new FormData(form);
    
    // Map form fields to the expected Google Apps Script field names
    const data = {
        date: formData.get('date'),
        a1_depressed: formData.get('a1_depressed'),
        a2_interest: formData.get('a2_interest'),
        a3_anxious: formData.get('a3_anxious'),
        a4_worry: formData.get('a4_worry'),
        b5_focus: formData.get('b5_focus'),
        b6_task_start: formData.get('b6_task_start'),
        b7_function: formData.get('b7_function'),
        c8_sleep_hrs: formData.get('c8_sleep_hrs'),
        c9_sleep_qual: formData.get('c9_sleep_qual'),
        c10_energy: formData.get('c10_energy'),
        d11_wired: formData.get('d11_wired'),
        d12_less_sleep: formData.get('d12_less_sleep'),
        d_asrm_total: formData.get('d_asrm_total') || '',
        e13_se_freq: formData.get('e13_se_freq'),
        e14_se_intensity: formData.get('e14_se_intensity'),
        e15_se_burden: formData.get('e15_se_burden'),
        f16_safety: formData.get('f16_safety'),
        notes: formData.get('notes') || ''
    };

    return data;
}

async function sendToGoogleSheets(data) {
    // Get the Google Apps Script Web App URL
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

    // Default to the provided Google Apps Script URL
    return 'https://script.google.com/macros/s/AKfycbxJETVSh8FasaFJUunijx4wyYr-n5KHZo0K2fCzBwzN44S4XQltFQ6OXFdERUXwf8ib/exec';
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

// Allow users to configure a different Google Apps Script URL via console if needed
window.configureMoodLog = function(scriptUrl) {
    if (!scriptUrl) {
        console.error('Please provide a Google Apps Script URL');
        return;
    }
    localStorage.setItem('googleScriptUrl', scriptUrl);
    console.log('✅ Google Apps Script URL configured successfully!');
    console.log('You can now submit check-ins to your Google Sheet.');
};

// Show info on load
console.log('🧠 Mental Health Tracking App');
console.log('Connected to Google Apps Script');
console.log('To use a different URL, run: configureMoodLog("YOUR_URL")');

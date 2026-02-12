// Configuration
const API_URL = "http://localhost:8000/api/sentry/check/";
const BLOCKED_PAGE_URL = "http://localhost:3000/blocked"; // We will create this page next

// 1. Listener: When a tab is updated (URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        
        // Ignore internal browser pages and our own blocked page
        if (tab.url.startsWith("chrome://") || tab.url.includes("localhost:3000/blocked")) {
            return;
        }

        checkUrl(tabId, tab.url);
    }
});

// 2. The Check Function
async function checkUrl(tabId, url) {
    try {
        // Get the logged-in student email from storage (saved by popup)
        const data = await chrome.storage.local.get(['student_email']);
        const email = data.student_email || 'anonymous';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, email: email })
        });

        const result = await response.json();

        if (result.status === 'BLOCKED') {
            // 3. Action: Redirect to warning page
            chrome.tabs.update(tabId, { url: `${BLOCKED_PAGE_URL}?ref=${encodeURIComponent(url)}` });
            
            // Optional: Send a notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Aegis Protection',
                message: 'Malicious site blocked.'
            });
        }
    } catch (error) {
        console.error("Aegis API Error:", error);
    }
}
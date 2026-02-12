document.addEventListener('DOMContentLoaded', () => {
    const API_URL = "http://localhost:8000/api/auth/login/";

    const loginView = document.getElementById('loginView');
    const connectedView = document.getElementById('connectedView');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const statusMsg = document.getElementById('statusMsg');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // 1. Check Login State on Load
    chrome.storage.local.get(['student_email', 'auth_token'], (result) => {
        if (result.auth_token && result.student_email) {
            showConnected(result.student_email);
        } else {
            showLogin();
        }
    });

    // 2. Handle Login Click
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                showError("Please enter email and password.");
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: email, password: password })
                });

                const data = await response.json();

                if (response.ok && data.access) {
                    // Success: Save Token & Email
                    chrome.storage.local.set({
                        'auth_token': data.access,
                        'student_email': email
                    }, () => {
                        fetch("http://127.0.0.1:8000/api/sentry/check/", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: "http://ping.aegis", email: email })
                        });
                        
                        showConnected(email);
                    });
                } else {
                    showError("Invalid credentials.");
                }
            } catch (err) {
                showError("Could not connect to server.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        });
    }

    // 3. Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            chrome.storage.local.remove(['student_email', 'auth_token'], () => {
                showLogin();
                emailInput.value = '';
                passwordInput.value = '';
                statusMsg.innerText = '';
            });
        });
    }

    // --- Helpers ---
    function showConnected(email) {
        loginView.style.display = 'none';
        connectedView.style.display = 'block';
        document.getElementById('displayEmail').innerText = email;
    }

    function showLogin() {
        loginView.style.display = 'block';
        connectedView.style.display = 'none';
    }

    function showError(msg) {
        statusMsg.innerText = msg;
        statusMsg.className = "status error";
        statusMsg.style.color = "#ef4444";
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loginBtn.innerText = "Verifying...";
            loginBtn.disabled = true;
            statusMsg.innerText = "";
        } else {
            loginBtn.innerText = "Sign In";
            loginBtn.disabled = false;
        }
    }
});
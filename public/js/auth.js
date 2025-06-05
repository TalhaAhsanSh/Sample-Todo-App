// frontend/js/auth.js
console.log('auth.js script started loading.');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired. Searching for auth forms.');

    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    // Message areas - ensure these IDs match your HTML
    const signupMessageElement = document.getElementById('signupMessageArea');
    const loginMessageElement = document.getElementById('loginMessageArea');

    console.log('Found signupForm:', signupForm);
    console.log('Found loginForm:', loginForm);
    console.log('Found signupMessageElement:', signupMessageElement);
    console.log('Found loginMessageElement:', loginMessageElement);


    // --- SIGNUP FORM LOGIC ---
    if (signupForm) {
        console.log('Attaching event listener to signupForm.');
        signupForm.addEventListener('submit', async function(event) {
            console.log('Signup form submitted.');
            event.preventDefault();
            if (signupMessageElement) clearMessage('signupMessageArea'); // Use the specific ID

            // Use the specific IDs from signup.html
            const nameInput = document.getElementById('signupName');
            const emailInput = document.getElementById('signupEmail');
            const passwordInput = document.getElementById('signupPassword');

            if (!nameInput || !emailInput || !passwordInput) {
                console.error('One or more signup input fields are missing!');
                if (signupMessageElement) displayMessage('signupMessageArea', 'Form fields are missing. Please refresh.', 'error');
                return;
            }

            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            
            console.log('Signup data:', { name, email, password: password ? 'Exists' : 'Empty' });

            try {
                const result = await makeApiRequest('/auth/signup', 'POST', { name, email, password }, false);
                if (signupMessageElement) displayMessage('signupMessageArea', result.message + ' Please check your email to verify.', 'success');
                signupForm.reset();
            } catch (error) {
                console.error('Signup API error:', error);
                if (signupMessageElement) displayMessage('signupMessageArea', error.data?.error || error.message || 'Signup failed.', 'error');
            }
        });
    } else {
        if (window.location.pathname.includes('signup.html')) {
            console.error('Critical: signupForm element NOT FOUND on signup.html!');
        }
    }

    // --- LOGIN FORM LOGIC ---
    if (loginForm) {
        console.log('Attaching event listener to loginForm.');
        loginForm.addEventListener('submit', async function(event) {
            console.log('Login form submitted.');
            event.preventDefault();
            if (loginMessageElement) clearMessage('loginMessageArea'); // Use the specific ID

            // Use the specific IDs you have in login.html (e.g., 'loginEmail', 'loginPassword')
            // For this example, I'll assume they are 'email' and 'password' as per previous generic setup.
            // IMPORTANT: Ensure these IDs match your login.html
            const emailInput = document.getElementById('email'); // Or 'loginEmail'
            const passwordInput = document.getElementById('password'); // Or 'loginPassword'

            if (!emailInput || !passwordInput) {
                console.error('One or more login input fields are missing!');
                if (loginMessageElement) displayMessage('loginMessageArea', 'Form fields are missing. Please refresh.', 'error');
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;
            console.log('Login attempt with Email:', email, 'Password:', password ? 'Exists' : 'Empty');

            try {
                const result = await makeApiRequest('/auth/login', 'POST', { email, password }, false);
                
                let token, userName;
                if (result.data && result.data.session && result.data.session.token) {
                    token = result.data.session.token;
                    userName = result.data.name;
                } else if (result.data && result.data.token) {
                     token = result.data.token;
                     userName = result.data.name;
                } else {
                    throw new Error("Token or user name not found in login response.");
                }

                saveToken(token);
                if (userName) saveUserName(userName);
                
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Login API error:', error);
                if (loginMessageElement) displayMessage('loginMessageArea', error.data?.error || error.message || 'Login failed.', 'error');
            }
        });
    } else {
        if (window.location.pathname.includes('login.html')) {
            console.error('Critical: loginForm element NOT FOUND on login.html!');
        }
    }
});
console.log('auth.js script finished loading.');

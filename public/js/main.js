// frontend/js/main.js
const API_BASE_URL = 'http://localhost:8000/api'; // Ensure this matches your backend setup

// --- Token Management ---
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName'); 
}

function isLoggedIn() {
    return !!getToken(); 
}

// --- User Info ---
function saveUserName(name) {
    localStorage.setItem('userName', name);
}

function getUserName() {
    return localStorage.getItem('userName');
}

// --- Utility for API calls ---
async function makeApiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = getToken();
        if (!token) {
            console.error('Authentication token not found for protected route. Redirecting to login.');
            window.location.href = 'login.html'; 
            throw new Error('Authentication token required.'); // Stop further execution
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(body);
    }

    console.log(`Making API Request: ${method} ${API_BASE_URL}${endpoint}`, body ? `with body: ${JSON.stringify(body)}` : '');

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        let result;
        const contentType = response.headers.get("content-type");

        if (response.status === 204) { // Handle No Content response
            result = { message: "Operation successful (No Content)", status: response.status, ok: response.ok, data: null };
        } else if (contentType && contentType.indexOf("application/json") !== -1) {
            result = await response.json();
        } else {
            const textResponse = await response.text(); // Get text for non-JSON for debugging
            console.warn(`Non-JSON response from ${method} ${endpoint}:`, textResponse);
            result = { message: textResponse || response.statusText, status: response.status, ok: response.ok, data: null };
            if (!response.ok && !result.error && !result.message) {
                 result.message = `Request failed with status ${response.status}`;
            }
        }
        
        console.log(`API Response for ${method} ${endpoint}:`, result);

        if (!response.ok) {
            // Construct a more informative error
            const errorMessage = result.error || result.message || (result.data && (result.data.error || result.data.message)) || `API request failed with status ${response.status}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = result; // Attach full result for more details if needed
            console.error('API Error Object:', error);
            throw error;
        }
        return result; 
    } catch (networkError) {
        // Handle network errors (e.g., server down, CORS if not configured properly on backend)
        console.error(`Network error during API Request to ${method} ${endpoint}:`, networkError);
        const error = new Error(`Network error or server unavailable: ${networkError.message}`);
        error.status = 0; // Indicate a network-level error
        error.data = { error: `Network error: ${networkError.message}` };
        throw error;
    }
}

// --- DOM Utility for displaying messages ---
function displayMessage(elementId, message, type = 'error') {
    const area = document.getElementById(elementId);
    if (area) {
        area.textContent = message;
        area.className = 'message-area ' + (type === 'error' ? 'error-message' : 'success-message');
        area.style.display = 'block';
        // Automatically hide after a few seconds
        setTimeout(() => {
            if (area.textContent === message) { // Only hide if message hasn't changed
                 clearMessage(elementId);
            }
        }, 5000);
    } else {
        console.error(`Message area with ID '${elementId}' not found.`);
    }
}

function clearMessage(elementId) {
    const area = document.getElementById(elementId);
    if (area) {
        area.textContent = '';
        area.className = 'message-area'; 
        area.style.display = 'none';
    }
}

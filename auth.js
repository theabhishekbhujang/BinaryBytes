// User Registration Function (Sends Data to Flask Backend)
function registerUser(event) {
    event.preventDefault(); // Prevent page reload

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === "Registration successful!") {
            window.location.href = "login.html"; // Redirect to login page
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// User Login Function (Verifies with Flask Backend)
function loginUser(event) {
    event.preventDefault(); // Prevent form refresh

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === "Login successful!") {
            sessionStorage.setItem("loggedInUser", username);
            window.location.href = "index.html"; // Redirect to main page
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Check if User is Logged In (Restrict Access to `index.html`)
function checkAuth() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        alert("⚠️ Please log in first.");
        window.location.href = "login.html";
    }
}

// Logout Function (Clears Session and Redirects)
function logoutUser() {
    sessionStorage.removeItem("loggedInUser");
    alert("✅ Logged out successfully.");
    window.location.href = "login.html";
}

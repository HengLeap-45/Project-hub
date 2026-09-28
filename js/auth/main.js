/**
 * Main Initialization File
 * Initializes the entire application on page load
 */

document.addEventListener("DOMContentLoaded", () => {
  // Setup theme toggle
  setupThemeToggle();

  // Initialize all forms
  initializeForms();

  // Check if user is logged in
  const hash = window.location.hash.substring(1); if (AuthSystem.isLoggedIn()) {
    showPage("dashboardPage");
    updateDashboard();
  } else {
    if (hash === "signup") { showPage("signupPage"); } else if (hash === "forgot") { showPage("forgotPasswordPage"); } else { showPage("loginPage"); }
  }

  console.log("AuthHub Authentication System Initialized");
});


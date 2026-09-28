/**
 * Main Initialization File
 * Initializes the entire application on page load
 */

document.addEventListener('DOMContentLoaded', () => {
  // Setup theme toggle
  setupThemeToggle();

  // Initialize all forms
  initializeForms();

  // Check if user is logged in
  if (AuthSystem.isLoggedIn()) {
    showPage('dashboardPage');
    updateDashboard();
  } else {
    showPage('loginPage');
  }

  console.log('AuthHub Authentication System Initialized');
});
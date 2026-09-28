/**
 * UI Utilities Module
 * Handles common UI operations and animations
 */

/**
 * Show specific page and hide others
 */
function showPage(pageId, event = null) {
  if (event) event.preventDefault();

  // Hide all pages
  document.querySelectorAll('.page').forEach((page) => {
    page.classList.remove('active');
  });

  // Show selected page
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }
}

/**
 * Show error message in a specific element
 */
function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    const span = errorEl.querySelector('span');
    if (span) {
      span.textContent = message;
    }
    errorEl.classList.remove('hidden');
  }
}

/**
 * Clear error message
 */
function clearError(elementId) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.classList.add('hidden');
  }
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'success') {
  const container = document.getElementById('notificationContainer');
  const notification = document.createElement('div');

  const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

  notification.className = `${bgColor} text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg animate-in slide-in-up pointer-events-auto`;
  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Setup password toggle button
 */
function setupPasswordToggle(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (!input || !button) return;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.innerHTML = isPassword
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
  });
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength(password) {
  const bars = [
    document.getElementById('strengthBar1'),
    document.getElementById('strengthBar2'),
    document.getElementById('strengthBar3'),
  ];
  const strengthText = document.getElementById('strengthText');

  // Reset bars
  bars.forEach((bar) => {
    bar.className = 'flex-1 rounded-full bg-[#334155]';
  });

  if (!password) {
    strengthText.textContent = 'Password strength: -';
    strengthText.className = 'text-xs text-[#cbd5e1] mt-1';
    return;
  }

  const strength = Validation.getPasswordStrength(password);
  let filledCount = 0;
  let colorClass = '';

  if (strength === 'weak') {
    filledCount = 1;
    colorClass = 'bg-red-500';
    strengthText.className = 'text-xs text-red-400 mt-1';
    strengthText.textContent = 'Password strength: Weak';
  } else if (strength === 'medium') {
    filledCount = 2;
    colorClass = 'bg-yellow-500';
    strengthText.className = 'text-xs text-yellow-400 mt-1';
    strengthText.textContent = 'Password strength: Medium';
  } else {
    filledCount = 3;
    colorClass = 'bg-emerald-500';
    strengthText.className = 'text-xs text-emerald-400 mt-1';
    strengthText.textContent = 'Password strength: Strong';
  }

  for (let i = 0; i < filledCount; i++) {
    bars[i].className = `flex-1 rounded-full ${colorClass}`;
  }
}

/**
 * Clear form and errors
 */
function clearFormAndErrors(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();

    // Clear all errors
    form.querySelectorAll('[id$="Error"]').forEach((el) => {
      el.classList.add('hidden');
    });
  }
}

/**
 * Disable/Enable button with loading state
 */
function setButtonLoading(buttonId, isLoading, originalText = null) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Loading...';
  } else {
    button.disabled = false;
    button.innerHTML = originalText || button.getAttribute('data-original-text') || 'Submit';
  }
}

/**
 * Setup theme toggle
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('authhub_theme') || 'dark';

  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    localStorage.setItem('authhub_theme', isLight ? 'light' : 'dark');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

/**
 * Update dashboard with current user info
 */
function updateDashboard() {
  if (!AuthSystem.currentUser) return;

  const user = AuthSystem.currentUser;
  const initial = user.fullName.charAt(0).toUpperCase();

  // Update sidebar
  document.getElementById('userAvatarSidebar').textContent = initial;
  document.getElementById('userNameSidebar').textContent = user.fullName;
  document.getElementById('userEmailSidebar').textContent = user.email;

  // Update overview
  document.getElementById('displayFullName').textContent = user.fullName;
  document.getElementById('displayUsername').textContent = '@' + user.username;
  document.getElementById('displayEmail').textContent = user.email;

  // Update edit profile form
  document.getElementById('editFullName').value = user.fullName;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editUsername').value = user.username;
}

/**
 * Update navigation active state
 */
function updateNavigation(index) {
  document.querySelectorAll('.nav-item').forEach((item, i) => {
    if (i === index) {
      item.classList.add('nav-item-active');
    } else {
      item.classList.remove('nav-item-active');
    }
  });
}

/**
 * Show dashboard overview
 */
function switchToDashboard() {
  document.getElementById('dashboardOverview').classList.remove('hidden');
  document.getElementById('editProfileContent').classList.add('hidden');
  document.getElementById('settingsContent').classList.add('hidden');
  document.getElementById('securityContent').classList.add('hidden');
  updateNavigation(0);
}

/**
 * Show edit profile section
 */
function openEditProfile() {
  document.getElementById('dashboardOverview').classList.add('hidden');
  document.getElementById('editProfileContent').classList.remove('hidden');
  document.getElementById('settingsContent').classList.add('hidden');
  document.getElementById('securityContent').classList.add('hidden');
  updateNavigation(1);
}

/**
 * Show settings section
 */
function openSettings() {
  document.getElementById('dashboardOverview').classList.add('hidden');
  document.getElementById('editProfileContent').classList.add('hidden');
  document.getElementById('settingsContent').classList.remove('hidden');
  document.getElementById('securityContent').classList.add('hidden');
  updateNavigation(2);
}

/**
 * Show security section
 */
function openSecurity() {
  document.getElementById('dashboardOverview').classList.add('hidden');
  document.getElementById('editProfileContent').classList.add('hidden');
  document.getElementById('settingsContent').classList.add('hidden');
  document.getElementById('securityContent').classList.remove('hidden');
  updateNavigation(3);
}

/**
 * Handle logout
 */
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    AuthSystem.logout();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
      showPage('loginPage');
      clearFormAndErrors('loginForm');
    }, 500);
  }
}

/**
 * Handle social login
 */
function handleSocialLogin(provider) {
  showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon`, 'error');
}

/**
 * Save settings
 */
function saveSettings() {
  showNotification('Settings saved successfully!', 'success');
  switchToDashboard();
}
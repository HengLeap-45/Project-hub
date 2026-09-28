/**
 * Form Handlers Module
 * Handles all form submissions and validation
 */

/**
 * Login Form Handler
 */
function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const loginBtn = document.getElementById("loginBtn");

    // Clear previous errors
    clearError("loginEmailError");
    clearError("loginPasswordError");

    // Validation
    let hasError = false;

    if (!email) {
      showError("loginEmailError", "Email or username is required");
      hasError = true;
    }

    if (!password) {
      showError("loginPasswordError", "Password is required");
      hasError = true;
    }

    if (hasError) return;

    // Simulate loading
    setButtonLoading("loginBtn", true, "Sign In");

    setTimeout(() => {
      if (AuthSystem.authenticate(email, password)) {
        showNotification("Signed in successfully!", "success");
        updateDashboard();
        setTimeout(() => {
          showPage("dashboardPage");
          setButtonLoading("loginBtn", false, "Sign In");
          clearFormAndErrors("loginForm");
        }, 500);
      } else {
        showError("loginEmailError", "Invalid email or password");
        setButtonLoading("loginBtn", false, "Sign In");
      }
    }, 1200);
  });

  // Setup password toggle
  setupPasswordToggle("loginPassword", "toggleLoginPassword");
}

/**
 * Sign Up Form Handler
 */
function setupSignupForm() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agreeTerms = document.getElementById("agreeTerms").checked;
    const signupBtn = document.getElementById("signupBtn");

    // Clear previous errors
    clearError("fullNameError");
    clearError("usernameError");
    clearError("signupEmailError");
    clearError("signupPasswordError");
    clearError("confirmPasswordError");

    // Validation
    let hasError = false;

    if (!Validation.isValidFullName(fullName)) {
      showError("fullNameError", "Full name must be at least 2 characters");
      hasError = true;
    }

    if (!Validation.isValidUsername(username)) {
      showError(
        "usernameError",
        "Username must be 3+ characters (alphanumeric, - and _ only)",
      );
      hasError = true;
    }

    if (!Validation.isValidEmail(email)) {
      showError("signupEmailError", "Please enter a valid email address");
      hasError = true;
    }

    if (!Validation.isValidPassword(password)) {
      showError(
        "signupPasswordError",
        "Password must be at least 8 characters",
      );
      hasError = true;
    }

    if (password !== confirmPassword) {
      showError("confirmPasswordError", "Passwords do not match");
      hasError = true;
    }

    if (!agreeTerms) {
      showNotification("You must agree to the Terms of Service", "error");
      hasError = true;
    }

    if (hasError) return;

    if (AuthSystem.userExists(email, username)) {
      showError("signupEmailError", "Email or username already exists");
      return;
    }

    // Simulate loading
    setButtonLoading("signupBtn", true, "Create Account");

    setTimeout(() => {
      AuthSystem.addUser({
        fullName,
        username,
        email,
        password,
      });

      AuthSystem.authenticate(email, password);
      showNotification("Account created successfully!", "success");
      updateDashboard();

      setTimeout(() => {
        showPage("dashboardPage");
        setButtonLoading("signupBtn", false, "Create Account");
        clearFormAndErrors("signupForm");
      }, 500);
    }, 1200);
  });

  // Setup password toggles
  setupPasswordToggle("signupPassword", "toggleSignupPassword");
  setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

  // Setup password strength indicator
  document.getElementById("signupPassword").addEventListener("input", (e) => {
    updatePasswordStrength(e.target.value);
  });
}

/**
 * Forgot Password Form Handler
 */
function setupForgotPasswordForm() {
  const form = document.getElementById("forgotPasswordForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("resetEmail").value.trim();
    const resetBtn = document.getElementById("resetBtn");

    clearError("resetEmailError");

    if (!Validation.isValidEmail(email)) {
      showError("resetEmailError", "Please enter a valid email address");
      return;
    }

    if (!AuthSystem.findUser(email)) {
      showError("resetEmailError", "No account found with this email");
      return;
    }

    // Simulate loading
    setButtonLoading("resetBtn", true, "Send Reset Link");

    setTimeout(() => {
      showNotification("Password reset link sent to your email!", "success");
      setButtonLoading("resetBtn", false, "Send Reset Link");
      form.reset();
      setTimeout(() => {
        showPage("loginPage");
      }, 2000);
    }, 1200);
  });
}

/**
 * Edit Profile Form Handler
 */
function setupEditProfileForm() {
  const form = document.getElementById("editProfileForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("editFullName").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    const username = document.getElementById("editUsername").value.trim();

    if (!Validation.isValidEmail(email)) {
      showNotification("Invalid email address", "error");
      return;
    }

    if (!Validation.isValidUsername(username)) {
      showNotification("Invalid username format", "error");
      return;
    }

    // Check if new email/username already exists (excluding current user)
    const duplicateUser = AuthSystem.users.find(
      (u) =>
        u.id !== AuthSystem.currentUser.id &&
        (u.email === email || u.username === username),
    );

    if (duplicateUser) {
      showNotification("Email or username already in use", "error");
      return;
    }

    AuthSystem.updateUser(AuthSystem.currentUser.id, {
      fullName,
      email,
      username,
    });

    showNotification("Profile updated successfully!", "success");
    updateDashboard();
    switchToDashboard();
  });
}

/**
 * Change Password Form Handler
 */
function setupChangePasswordForm() {
  const form = document.getElementById("changePasswordForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;

    if (!AuthSystem.currentUser) return;

    const user = AuthSystem.users.find(
      (u) => u.id === AuthSystem.currentUser.id,
    );

    if (!user || user.password !== currentPassword) {
      showNotification("Current password is incorrect", "error");
      return;
    }

    if (!Validation.isValidPassword(newPassword)) {
      showNotification("New password must be at least 8 characters", "error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    AuthSystem.updateUser(AuthSystem.currentUser.id, {
      password: newPassword,
    });

    showNotification("Password updated successfully!", "success");
    form.reset();
    switchToDashboard();
  });
}

/**
 * Initialize all form handlers
 */
function initializeForms() {
  setupLoginForm();
  setupSignupForm();
  setupForgotPasswordForm();
  setupEditProfileForm();
  setupChangePasswordForm();
}

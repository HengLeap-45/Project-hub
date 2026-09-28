/**
 * Authentication System Module
 * Handles user registration, login, and session management
 */

const AuthSystem = {
  users: JSON.parse(localStorage.getItem("authhub_users")) || [],
  currentUser: JSON.parse(localStorage.getItem("authhub_currentUser")) || null,

  /**
   * Add a new user to the system
   */
  addUser(userData) {
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.save();
    return user;
  },

  /**
   * Find user by email or username
   */
  findUser(identifier) {
    return this.users.find(
      (u) => u.email === identifier || u.username === identifier,
    );
  },

  /**
   * Authenticate user with email/username and password
   */
  authenticate(identifier, password) {
    const user = this.findUser(identifier);
    if (user && user.password === password) {
      this.currentUser = {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      };
      localStorage.setItem(
        "authhub_currentUser",
        JSON.stringify(this.currentUser),
      );
      return true;
    }
    return false;
  },

  /**
   * Logout current user
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem("authhub_currentUser");
  },

  /**
   * Check if user email or username already exists
   */
  userExists(email, username) {
    return this.users.some((u) => u.email === email || u.username === username);
  },

  /**
   * Update user information
   */
  updateUser(userId, updates) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      this.save();

      // Update current user if it's the logged-in user
      if (this.currentUser && this.currentUser.id === userId) {
        Object.assign(this.currentUser, {
          fullName: updates.fullName || this.currentUser.fullName,
          email: updates.email || this.currentUser.email,
          username: updates.username || this.currentUser.username,
        });
        localStorage.setItem(
          "authhub_currentUser",
          JSON.stringify(this.currentUser),
        );
      }
      return user;
    }
    return null;
  },

  /**
   * Save users to localStorage
   */
  save() {
    localStorage.setItem("authhub_users", JSON.stringify(this.users));
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.currentUser !== null;
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  },
};

/**
 * Validation Module
 * Handles form validation logic
 */
const Validation = {
  /**
   * Validate email format
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Validate username format
   */
  isValidUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
  },

  /**
   * Validate password minimum length
   */
  isValidPassword(password) {
    return password.length >= 8;
  },

  /**
   * Get password strength level
   */
  getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return "weak";
    if (strength <= 3) return "medium";
    return "strong";
  },

  /**
   * Validate full name
   */
  isValidFullName(name) {
    return name.trim().length >= 2;
  },
};

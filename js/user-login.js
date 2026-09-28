
        // =====================================
        // Authentication System
        // =====================================

        const AuthSystem = {
            users: JSON.parse(localStorage.getItem('authhub_users')) || [],
            currentUser: JSON.parse(localStorage.getItem('authhub_currentUser')) || null,

            addUser(userData) {
                const user = {
                    id: Date.now().toString(),
                    ...userData,
                    createdAt: new Date().toISOString()
                };
                this.users.push(user);
                this.save();
                return user;
            },

            findUser(identifier) {
                return this.users.find(u => 
                    u.email === identifier || u.username === identifier
                );
            },

            authenticate(identifier, password) {
                const user = this.findUser(identifier);
                if (user && user.password === password) {
                    this.currentUser = {
                        id: user.id,
                        fullName: user.fullName,
                        username: user.username,
                        email: user.email
                    };
                    localStorage.setItem('authhub_currentUser', JSON.stringify(this.currentUser));
                    return true;
                }
                return false;
            },

            logout() {
                this.currentUser = null;
                localStorage.removeItem('authhub_currentUser');
            },

            userExists(email, username) {
                return this.users.some(u => u.email === email || u.username === username);
            },

            updateUser(userId, updates) {
                const user = this.users.find(u => u.id === userId);
                if (user) {
                    Object.assign(user, updates);
                    this.save();
                    if (this.currentUser && this.currentUser.id === userId) {
                        Object.assign(this.currentUser, {
                            fullName: updates.fullName || this.currentUser.fullName,
                            email: updates.email || this.currentUser.email,
                            username: updates.username || this.currentUser.username
                        });
                        localStorage.setItem('authhub_currentUser', JSON.stringify(this.currentUser));
                    }
                    return user;
                }
                return null;
            },

            save() {
                localStorage.setItem('authhub_users', JSON.stringify(this.users));
            }
        };

        // =====================================
        // Validation System
        // =====================================

        const Validation = {
            isValidEmail(email) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            },

            isValidUsername(username) {
                return username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
            },

            isValidPassword(password) {
                return password.length >= 8;
            },

            getPasswordStrength(password) {
                let strength = 0;
                if (password.length >= 8) strength++;
                if (password.length >= 12) strength++;
                if (/[A-Z]/.test(password)) strength++;
                if (/[0-9]/.test(password)) strength++;
                if (/[^A-Za-z0-9]/.test(password)) strength++;

                if (strength <= 1) return 'weak';
                if (strength <= 3) return 'medium';
                return 'strong';
            }
        };

        // =====================================
        // UI Functions
        // =====================================

        function showPage(pageId, event) {
            if (event) event.preventDefault();
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            window.scrollTo(0, 0);
        }

        function clearError(elementId) {
            const errorEl = document.getElementById(elementId);
            if (errorEl) {
                errorEl.style.display = 'none';
            }
        }

        function showError(elementId, message) {
            const errorEl = document.getElementById(elementId);
            if (errorEl) {
                errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                errorEl.style.display = 'block';
            }
        }

        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span class="notification-icon">
                    ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>'}
                </span>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // =====================================
        // Theme Toggle
        // =====================================

        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        // Load saved theme
        const savedTheme = localStorage.getItem('authhub_theme') || 'dark';
        if (savedTheme === 'light') {
            html.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            html.classList.toggle('light-mode');
            const isLight = html.classList.contains('light-mode');
            localStorage.setItem('authhub_theme', isLight ? 'light' : 'dark');
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });

        // =====================================
        // Password Toggle
        // =====================================

        function setupPasswordToggle(inputId, buttonId) {
            const input = document.getElementById(inputId);
            const button = document.getElementById(buttonId);

            button.addEventListener('click', (e) => {
                e.preventDefault();
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                button.innerHTML = isPassword 
                    ? '<i class="fas fa-eye-slash"></i>' 
                    : '<i class="fas fa-eye"></i>';
            });
        }

        setupPasswordToggle('loginPassword', 'toggleLoginPassword');
        setupPasswordToggle('signupPassword', 'toggleSignupPassword');
        setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');

        // =====================================
        // Password Strength Indicator
        // =====================================

        document.getElementById('signupPassword').addEventListener('input', function() {
            const password = this.value;
            const bars = document.querySelectorAll('.password-strength .strength-bar');
            const strengthText = document.getElementById('strengthText');

            bars.forEach(bar => {
                bar.classList.remove('filled', 'medium', 'strong');
            });

            if (password) {
                const strength = Validation.getPasswordStrength(password);
                let filledCount = 0;

                if (strength === 'weak') filledCount = 1;
                if (strength === 'medium') filledCount = 2;
                if (strength === 'strong') filledCount = 3;

                for (let i = 0; i < filledCount; i++) {
                    bars[i].classList.add('filled');
                    if (strength === 'medium') bars[i].classList.add('medium');
                    if (strength === 'strong') bars[i].classList.add('strong');
                }

                strengthText.textContent = `Password strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}`;
                strengthText.className = `strength-text ${strength}`;
            } else {
                strengthText.textContent = 'Password strength: -';
                strengthText.className = 'strength-text';
            }
        });

        // =====================================
        // Login Handler
        // =====================================

        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const loginBtn = document.getElementById('loginBtn');

            clearError('loginEmailError');
            clearError('loginPasswordError');

            let hasError = false;
            if (!email) {
                showError('loginEmailError', 'Email or username is required');
                hasError = true;
            }

            if (!password) {
                showError('loginPasswordError', 'Password is required');
                hasError = true;
            }

            if (hasError) return;

            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="spinner"></span> Signing In...';

            setTimeout(() => {
                if (AuthSystem.authenticate(email, password)) {
                    showNotification('Signed in successfully!', 'success');
                    updateDashboard();
                    setTimeout(() => {
                        showPage('dashboardPage');
                        loginBtn.disabled = false;
                        loginBtn.innerHTML = 'Sign In';
                        this.reset();
                    }, 500);
                } else {
                    showError('loginEmailError', 'Invalid email or password');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = 'Sign In';
                }
            }, 1200);
        });

        // =====================================
        // Sign Up Handler
        // =====================================

        document.getElementById('signupForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            const signupBtn = document.getElementById('signupBtn');

            clearError('fullNameError');
            clearError('usernameError');
            clearError('signupEmailError');
            clearError('signupPasswordError');
            clearError('confirmPasswordError');

            let hasError = false;

            if (!fullName || fullName.length < 2) {
                showError('fullNameError', 'Full name must be at least 2 characters');
                hasError = true;
            }

            if (!Validation.isValidUsername(username)) {
                showError('usernameError', 'Username must be 3+ chars (letters, numbers, - and _ only)');
                hasError = true;
            }

            if (!Validation.isValidEmail(email)) {
                showError('signupEmailError', 'Please enter a valid email address');
                hasError = true;
            }

            if (!Validation.isValidPassword(password)) {
                showError('signupPasswordError', 'Password must be at least 8 characters');
                hasError = true;
            }

            if (password !== confirmPassword) {
                showError('confirmPasswordError', 'Passwords do not match');
                hasError = true;
            }

            if (!agreeTerms) {
                showNotification('You must agree to the Terms of Service', 'error');
                hasError = true;
            }

            if (hasError) return;

            if (AuthSystem.userExists(email, username)) {
                showError('signupEmailError', 'Email or username already exists');
                return;
            }

            signupBtn.disabled = true;
            signupBtn.innerHTML = '<span class="spinner"></span> Creating Account...';

            setTimeout(() => {
                AuthSystem.addUser({
                    fullName,
                    username,
                    email,
                    password
                });

                AuthSystem.authenticate(email, password);
                showNotification('Account created successfully!', 'success');
                updateDashboard();

                setTimeout(() => {
                    showPage('dashboardPage');
                    signupBtn.disabled = false;
                    signupBtn.innerHTML = 'Create Account';
                    this.reset();
                }, 500);
            }, 1200);
        });

        // =====================================
        // Forgot Password Handler
        // =====================================

        document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('resetEmail').value.trim();
            const resetBtn = document.getElementById('resetBtn');

            clearError('resetEmailError');

            if (!Validation.isValidEmail(email)) {
                showError('resetEmailError', 'Please enter a valid email address');
                return;
            }

            if (!AuthSystem.findUser(email)) {
                showError('resetEmailError', 'No account found with this email');
                return;
            }

            resetBtn.disabled = true;
            resetBtn.innerHTML = '<span class="spinner"></span> Sending...';

            setTimeout(() => {
                showNotification('Password reset link sent to your email!', 'success');
                resetBtn.disabled = false;
                resetBtn.innerHTML = 'Send Reset Link';
                this.reset();
                setTimeout(() => {
                    showPage('loginPage');
                }, 2000);
            }, 1200);
        });

        // =====================================
        // Edit Profile Handler
        // =====================================

        document.getElementById('editProfileForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const fullName = document.getElementById('editFullName').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            const username = document.getElementById('editUsername').value.trim();

            if (!Validation.isValidEmail(email)) {
                showNotification('Invalid email address', 'error');
                return;
            }

            if (!Validation.isValidUsername(username)) {
                showNotification('Invalid username format', 'error');
                return;
            }

            const duplicateUser = AuthSystem.users.find(u => 
                u.id !== AuthSystem.currentUser.id && 
                (u.email === email || u.username === username)
            );

            if (duplicateUser) {
                showNotification('Email or username already in use', 'error');
                return;
            }

            AuthSystem.updateUser(AuthSystem.currentUser.id, {
                fullName,
                email,
                username
            });

            showNotification('Profile updated successfully!', 'success');
            updateDashboard();
            switchToDashboard();
        });

        // =====================================
        // Change Password Handler
        // =====================================

        document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;

            if (!AuthSystem.currentUser) return;

            const user = AuthSystem.users.find(u => u.id === AuthSystem.currentUser.id);
            if (!user || user.password !== currentPassword) {
                showNotification('Current password is incorrect', 'error');
                return;
            }

            if (!Validation.isValidPassword(newPassword)) {
                showNotification('New password must be at least 8 characters', 'error');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            AuthSystem.updateUser(AuthSystem.currentUser.id, {
                password: newPassword
            });

            showNotification('Password updated successfully!', 'success');
            this.reset();
            switchToDashboard();
        });

        // =====================================
        // Dashboard Functions
        // =====================================

        function updateDashboard() {
            if (AuthSystem.currentUser) {
                const user = AuthSystem.currentUser;
                const initial = user.fullName.charAt(0).toUpperCase();

                document.getElementById('userAvatarSidebar').textContent = initial;
                document.getElementById('userNameSidebar').textContent = user.fullName;
                document.getElementById('userEmailSidebar').textContent = user.email;

                document.getElementById('displayFullName').textContent = user.fullName;
                document.getElementById('displayUsername').textContent = '@' + user.username;
                document.getElementById('displayEmail').textContent = user.email;

                document.getElementById('editFullName').value = user.fullName;
                document.getElementById('editEmail').value = user.email;
                document.getElementById('editUsername').value = user.username;
            }
        }

        function switchToDashboard() {
            document.getElementById('dashboardOverview').style.display = 'block';
            document.getElementById('editProfileContent').style.display = 'none';
            document.getElementById('settingsContent').style.display = 'none';
            document.getElementById('securityContent').style.display = 'none';
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.nav-item')[0].classList.add('active');
        }

        function openEditProfile() {
            document.getElementById('dashboardOverview').style.display = 'none';
            document.getElementById('editProfileContent').style.display = 'block';
            document.getElementById('settingsContent').style.display = 'none';
            document.getElementById('securityContent').style.display = 'none';
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.nav-item')[1].classList.add('active');
        }

        function openSettings() {
            document.getElementById('dashboardOverview').style.display = 'none';
            document.getElementById('editProfileContent').style.display = 'none';
            document.getElementById('settingsContent').style.display = 'block';
            document.getElementById('securityContent').style.display = 'none';
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.nav-item')[2].classList.add('active');
        }

        function openSecurity() {
            document.getElementById('dashboardOverview').style.display = 'none';
            document.getElementById('editProfileContent').style.display = 'none';
            document.getElementById('settingsContent').style.display = 'none';
            document.getElementById('securityContent').style.display = 'block';
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.nav-item')[3].classList.add('active');
        }

        function saveSettings() {
            showNotification('Settings saved successfully!', 'success');
            switchToDashboard();
        }

        function handleLogout() {
            if (confirm('Are you sure you want to logout?')) {
                AuthSystem.logout();
                showNotification('Logged out successfully', 'success');
                setTimeout(() => {
                    showPage('loginPage');
                }, 500);
            }
        }

        function handleSocialLogin(provider) {
            showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon`, 'error');
        }

        // =====================================
        // Initialize
        // =====================================

        if (AuthSystem.currentUser) {
            showPage('dashboardPage');
            updateDashboard();
        } else {
            showPage('loginPage');
        }
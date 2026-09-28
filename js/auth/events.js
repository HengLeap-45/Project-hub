/**
 * Event Listeners for Auth Pages
 * Separated from HTML to keep code clean and strictly JS
 */
document.addEventListener('DOMContentLoaded', () => {
    // Single ID elements
    const linkForgotPassword = document.getElementById('linkForgotPassword');
    if (linkForgotPassword) linkForgotPassword.addEventListener('click', (e) => showPage('forgotPasswordPage', e));

    const btnSocialGoogle = document.getElementById('btnSocialGoogle');
    if (btnSocialGoogle) btnSocialGoogle.addEventListener('click', () => handleSocialLogin('google'));

    const btnSocialGithub = document.getElementById('btnSocialGithub');
    if (btnSocialGithub) btnSocialGithub.addEventListener('click', () => handleSocialLogin('github'));

    const btnSocialMicrosoft = document.getElementById('btnSocialMicrosoft');
    if (btnSocialMicrosoft) btnSocialMicrosoft.addEventListener('click', () => handleSocialLogin('microsoft'));

    const linkSignup = document.getElementById('linkSignup');
    if (linkSignup) linkSignup.addEventListener('click', (e) => showPage('signupPage', e));

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) btnLogout.addEventListener('click', () => handleLogout());

    const btnSaveSettings = document.getElementById('btnSaveSettings');
    if (btnSaveSettings) btnSaveSettings.addEventListener('click', () => saveSettings());

    // Multiple elements using data-action
    document.querySelectorAll('[data-action="prevent-default"]').forEach(el => {
        el.addEventListener('click', (e) => e.preventDefault());
    });

    document.querySelectorAll('[data-action="linkLogin"]').forEach(el => {
        el.addEventListener('click', (e) => showPage('loginPage', e));
    });

    document.querySelectorAll('[data-action="btnToDashboard"]').forEach(el => {
        el.addEventListener('click', () => switchToDashboard());
    });

    document.querySelectorAll('[data-action="btnEditProfile"]').forEach(el => {
        el.addEventListener('click', () => openEditProfile());
    });

    document.querySelectorAll('[data-action="btnSettings"]').forEach(el => {
        el.addEventListener('click', () => openSettings());
    });

    document.querySelectorAll('[data-action="btnSecurity"]').forEach(el => {
        el.addEventListener('click', () => openSecurity());
    });
});

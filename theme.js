const themeToggle = document.querySelector('#themeToggle');

if (themeToggle) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');

    function syncThemeButton() {
        const isDark = document.documentElement.dataset.theme === 'dark';
        themeIcon.textContent = isDark ? '☾' : '☀';
        themeText.textContent = isDark ? '다크' : '화이트';
        themeToggle.setAttribute('aria-label', isDark ? '화이트 모드로 변경' : '다크 모드로 변경');
    }

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        try {
            localStorage.setItem('pto-theme', nextTheme);
        } catch {
            // Theme still changes for the current session when storage is unavailable.
        }
        syncThemeButton();
    });

    syncThemeButton();
}

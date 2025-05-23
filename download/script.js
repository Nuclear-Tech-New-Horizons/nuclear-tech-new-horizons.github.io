document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('language') || 'en';
    let currentTheme = localStorage.getItem('theme') || 'dark';
    let translations = {};
    let versions = {};

    function setTheme(theme) {
        document.body.classList.toggle('light-theme', theme === 'light');
        localStorage.setItem('theme', theme);
        document.getElementById('theme-toggle').textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    function setLanguage(lang) {
        fetch(`./${lang}.json`)
            .then(response => response.json())
            .then(data => {
                translations[lang] = data;
                updateTranslations();
                document.getElementById('lang-ru').classList.toggle('active', lang === 'ru');
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                localStorage.setItem('language', lang);
            })
            .catch(error => console.error('Error loading translations:', error));
    }

    function updateTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (key === 'version') {
                const versionNumber = el.getAttribute('data-version');
                el.textContent = `${translations[currentLang].version} ${versionNumber}`;
            } else {
                el.textContent = translations[currentLang][key];
            }
        });
    }

    function loadVersions() {
        fetch(`./versions.json?v=${new Date().getTime()}`)
            .then(response => response.json())
            .then(data => {
                versions = data;
                console.log('Loaded versions:', versions);
                updateVersionList();
                updateDownloadLinks();
            })
            .catch(error => console.error('Error loading versions:', error));
    }

    function updateVersionList() {
        const versionList = document.querySelector('.version-list.populate-versions');
        if (versionList) {
            versionList.innerHTML = '';
            Object.keys(versions).forEach(version => {
                const link = document.createElement('a');
                link.href = `/download/download.html?version=${version}`;
                link.className = 'version-button';
                link.setAttribute('data-translate', 'version');
                link.setAttribute('data-version', version);
                link.textContent = `${translations[currentLang].version} ${version}`;
                versionList.appendChild(link);
            });
        }
    }

    function updateDownloadLinks() {
        const urlParams = new URLSearchParams(window.location.search);
        const version = urlParams.get('version');
        if (version && versions[version] && window.location.pathname.includes('download.html')) {
            document.getElementById('mmcPrismLink').href = versions[version].mmcPrism;
            document.getElementById('nativeLink').href = versions[version].native;
        }
    }

    setTheme(currentTheme);
    setLanguage(currentLang);
    loadVersions();

    document.getElementById('theme-toggle').addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });

    document.getElementById('lang-ru').addEventListener('click', () => setLanguage('ru'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
});

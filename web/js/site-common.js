(function () {
    /** Depuis / ou /index.html → pages/reseaux.html ; depuis /pages/*.html → reseaux.html */
    function reseauxFallbackPath() {
        var p = (window.location.pathname || '').replace(/\\/g, '/');
        if (p.indexOf('/pages/') !== -1) {
            return 'reseaux.html';
        }
        return 'pages/reseaux.html';
    }

    function applySocialLinks() {
        var cfg = window.PULSECAST_CONFIG || {};
        var social = cfg.social || {};
        document.querySelectorAll('[data-social]').forEach(function (el) {
            var key = el.getAttribute('data-social');
            var url = social[key];
            if (url && /^https?:\/\//i.test(String(url).trim())) {
                el.setAttribute('href', url.trim());
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            } else {
                el.setAttribute('href', reseauxFallbackPath());
                el.removeAttribute('target');
                el.removeAttribute('rel');
            }
        });
    }

    function initMobileNav() {
        var btn = document.querySelector('[data-mobile-menu-btn]');
        var panel = document.querySelector('[data-mobile-menu]');
        if (!btn || !panel) return;

        btn.addEventListener('click', function () {
            var open = panel.classList.toggle('hidden') === false;
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        panel.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                panel.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function setFooterYear() {
        var y = document.getElementById('footer-year');
        if (y) y.textContent = String(new Date().getFullYear());
    }

    document.addEventListener('DOMContentLoaded', function () {
        applySocialLinks();
        initMobileNav();
        setFooterYear();
    });
})();

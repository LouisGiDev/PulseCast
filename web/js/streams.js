(function () {
    function normalizeChannel(raw) {
        if (raw == null || typeof raw !== 'string') return '';
        var s = raw.trim();
        var m = s.match(/twitch\.tv\/([^/?#]+)/i);
        if (m) return m[1].toLowerCase();
        return s.replace(/^@/, '').toLowerCase();
    }

    /**
     * Domaines autorisés par Twitch pour l’embed (obligatoire — sinon Firefox bloque l’iframe).
     * @see https://dev.twitch.tv/docs/embed/video-and-clips/
     */
    function twitchParents() {
        var h = window.location.hostname;
        if (!h) {
            return ['localhost'];
        }
        var arr = [h];
        if (h === 'localhost') {
            arr.push('127.0.0.1');
        } else if (h === '127.0.0.1') {
            arr.push('localhost');
        }
        return arr;
    }

    function el(tag, className, html) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (html != null) e.innerHTML = html;
        return e;
    }

    function escapeHtml(t) {
        var d = document.createElement('div');
        d.textContent = t;
        return d.innerHTML;
    }

    function buildItems() {
        var cfg = window.PULSECAST_CONFIG || {};
        var list = cfg.streamers;
        if (!Array.isArray(list)) return [];
        return list
            .map(function (row) {
                var login = normalizeChannel(row.channel);
                if (!login) return null;
                return {
                    title: (row.title && String(row.title).trim()) || login,
                    login: login
                };
            })
            .filter(Boolean);
    }

    function loadTwitchEmbedScript() {
        return new Promise(function (resolve, reject) {
            if (window.Twitch && window.Twitch.Embed) {
                resolve();
                return;
            }
            var s = document.createElement('script');
            s.src = 'https://player.twitch.tv/js/embed/v1.js';
            s.async = true;
            s.onload = function () {
                resolve();
            };
            s.onerror = function () {
                reject(new Error('Chargement du script Twitch'));
            };
            document.head.appendChild(s);
        });
    }

    function buildChrome(s) {
        var chrome = el(
            'div',
            'twitch-chrome flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-surface-raised border border-surface-border border-b-0 rounded-t-xl'
        );
        var left = el('div', 'flex items-center gap-3 min-w-0 flex-1');
        left.appendChild(el('span', 'live-dot shrink-0', ''));
        var titles = el('div', 'min-w-0 font-display');
        titles.appendChild(
            el('h3', 'text-surface-text font-semibold text-base sm:text-lg truncate', escapeHtml(s.title))
        );
        titles.appendChild(
            el('p', 'text-xs text-surface-muted truncate', 'twitch.tv/' + escapeHtml(s.login))
        );
        left.appendChild(titles);

        var open = el(
            'a',
            'shrink-0 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-soft transition hover:bg-white/5 hover:text-white',
            '<i class="fa-brands fa-twitch" aria-hidden="true"></i><span>Voir sur Twitch</span>'
        );
        open.href = 'https://www.twitch.tv/' + encodeURIComponent(s.login);
        open.target = '_blank';
        open.rel = 'noopener noreferrer';

        chrome.appendChild(left);
        chrome.appendChild(open);
        return chrome;
    }

    /** Lecteur intégré via API officielle (évite le blocage Firefox lié à une iframe « parent » incorrecte) */
    function mountTwitchEmbeds(items) {
        loadTwitchEmbedScript()
            .then(function () {
                if (!window.Twitch || !window.Twitch.Embed) {
                    throw new Error('Twitch.Embed indisponible');
                }
                var parents = twitchParents();
                items.forEach(function (s, i) {
                    var id = 'pulse-twitch-embed-' + i;
                    try {
                        new window.Twitch.Embed(id, {
                            width: '100%',
                            height: 480,
                            channel: s.login,
                            layout: 'video',
                            theme: 'dark',
                            parent: parents
                        });
                    } catch (err) {
                        console.warn('PulseCast: embed Twitch', err);
                        var slot = document.getElementById(id);
                        if (slot) {
                            slot.innerHTML = '';
                            slot.appendChild(linkFallbackBlock(s));
                        }
                    }
                });
            })
            .catch(function () {
                items.forEach(function (s, i) {
                    var slot = document.getElementById('pulse-twitch-embed-' + i);
                    if (slot) {
                        slot.innerHTML = '';
                        slot.appendChild(linkFallbackBlock(s));
                    }
                });
            });
    }

    /** Aperçu + bouton — aucun iframe (contournement si le navigateur bloque encore l’embed) */
    function linkFallbackBlock(s) {
        var wrap = el(
            'div',
            'flex flex-col items-center justify-center gap-4 p-6 bg-surface min-h-[280px]'
        );
        var thumb = el(
            'div',
            'relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden border border-surface-border bg-black shadow-inner'
        );
        var img = document.createElement('img');
        img.src =
            'https://static-cdn.jtvnw.net/previews-ttv/live_user_' +
            encodeURIComponent(s.login.toLowerCase()) +
            '-640x360.jpg';
        img.alt = '';
        img.className = 'w-full h-full object-cover';
        img.loading = 'lazy';
        thumb.appendChild(img);

        var btn = el(
            'a',
            'inline-flex items-center gap-2 rounded-md bg-[#9146ff] hover:bg-[#772ce8] px-6 py-3 text-white font-semibold text-sm transition',
            '<i class="fa-brands fa-twitch text-xl"></i><span>Regarder sur Twitch</span>'
        );
        btn.href = 'https://www.twitch.tv/' + encodeURIComponent(s.login);
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';

        wrap.appendChild(thumb);
        wrap.appendChild(btn);
        wrap.appendChild(
            el(
                'p',
                'text-xs text-surface-muted text-center max-w-md',
                'Le lecteur intégré est désactivé ou bloqué. Le visionnage s’ouvre sur Twitch dans un nouvel onglet.'
            )
        );
        return wrap;
    }

    function renderLinkMode(items, prependEl) {
        var container = document.getElementById('streamers-list');
        if (!container) return;
        container.innerHTML = '';
        if (prependEl) {
            container.appendChild(prependEl);
        }
        var grid = el('div', 'flex flex-col gap-8');
        items.forEach(function (s) {
            var card = el('article', 'twitch-channel-card stream-card shadow-card');
            card.appendChild(buildChrome(s));
            var body = el(
                'div',
                'rounded-b-xl overflow-hidden border border-surface-border border-t-0'
            );
            body.appendChild(linkFallbackBlock(s));
            card.appendChild(body);
            grid.appendChild(card);
        });
        container.appendChild(grid);
    }

    function renderPlayerMode(items) {
        var container = document.getElementById('streamers-list');
        if (!container) return;
        container.innerHTML = '';
        var grid = el('div', 'flex flex-col gap-8');
        items.forEach(function (s, i) {
            var card = el('article', 'twitch-channel-card stream-card');
            card.appendChild(buildChrome(s));
            var slot = el(
                'div',
                'relative w-full min-h-[480px] bg-black rounded-b-lg overflow-hidden border border-[#2f2f35] border-t-0'
            );
            var mount = document.createElement('div');
            mount.id = 'pulse-twitch-embed-' + i;
            mount.className = 'w-full h-full min-h-[480px]';
            slot.appendChild(mount);
            card.appendChild(slot);
            grid.appendChild(card);
        });
        container.appendChild(grid);
        mountTwitchEmbeds(items);
    }

    function render() {
        var container = document.getElementById('streamers-list');
        if (!container) return;

        var cfg = window.PULSECAST_CONFIG || {};
        var embedMode = cfg.embedMode === 'link' ? 'link' : 'player';

        var items = buildItems();
        if (!items.length) {
            container.appendChild(
                el(
                    'div',
                    'twitch-empty rounded-2xl border border-dashed border-surface-border bg-surface-raised/80 px-6 py-14 text-center',
                    '<p class="font-display text-surface-text font-semibold mb-2">Aucune chaîne configurée</p>' +
                        '<p class="text-sm text-surface-muted max-w-md mx-auto">Édite <code class="text-brand-soft bg-black/40 px-1.5 py-0.5 rounded text-xs font-mono">frontend/js/config.js</code> — tableau <code class="text-brand-soft bg-black/40 px-1.5 py-0.5 rounded text-xs font-mono">streamers</code>.</p>'
                )
            );
            return;
        }

        if (embedMode === 'link') {
            renderLinkMode(items);
            return;
        }

        if (!window.location.hostname && window.location.protocol === 'file:') {
            var warn = el(
                'div',
                'rounded-lg border border-amber-800/80 bg-amber-950/40 px-4 py-3 text-sm text-amber-100 mb-6',
                'Ouvre ce site via un petit serveur HTTP (ex. <code class="text-amber-200">npx serve frontend</code>), pas en double-cliquant sur le HTML — Twitch exige une origine <code class="text-amber-200">http://localhost</code> ou ton domaine pour le lecteur intégré. Ci-dessous : aperçu + lien vers Twitch.'
            );
            renderLinkMode(items, warn);
            return;
        }

        renderPlayerMode(items);
    }

    document.addEventListener('DOMContentLoaded', render);
})();

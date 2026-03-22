# PulseCast

Vitrine **100 % statique** pour regrouper les **streams Twitch** de ta communauté sur une seule page. **Pas de backend** : HTML, CSS, JavaScript et un fichier de configuration.

- Lecteur officiel Twitch (`embed/v1.js`) avec paramètre `parent` correct (dont Firefox).
- Interface **Tailwind CSS** (CDN + `tailwind-config.js`), polices Inter / Plus Jakarta Sans.
- Pages légales, à propos et réseaux sociaux ; liens sociaux pilotés par la config.

## Démarrage rapide

1. Clone ou télécharge le dépôt.
2. Édite **`web/js/config.js`** : tableau **`streamers`** (`title` + `channel` = pseudo Twitch).
3. Sers le dossier **`web/`** en HTTP (obligatoire : Twitch ne permet pas l’embed en `file://`).

```bash
npx --yes serve web -p 5173
```

Ouvre **http://localhost:5173** ou **http://127.0.0.1:5173** (les deux sont gérés pour le `parent` Twitch).

### Exemple `streamers`

```js
streamers: [
  { title: 'Nom affiché', channel: 'pseudo_twitch' },
  { title: 'Autre live', channel: 'autre_chaine' },
],
```

### `embedMode` (`web/js/config.js`)

| Valeur      | Comportement |
|------------|----------------|
| `'player'` | Lecteur intégré via le script officiel Twitch (défaut). |
| `'link'`   | Pas d’iframe : aperçu + bouton vers twitch.tv (utile si blocage navigateur). |

En **production**, déploie le contenu de **`web/`** derrière **HTTPS** sur ton **nom de domaine** (le script envoie ce domaine à Twitch comme `parent`).

### Réseaux sociaux

Dans **`social`** (Discord, X, Instagram, YouTube), mets des URLs complètes en `https://`. Tant qu’une entrée est vide, les icônes pointent vers la page **Réseaux** pour guider la configuration.

## Firefox / fichier local

- En ouvrant le HTML en **double-clic** (`file://`), le lecteur intégré peut être refusé : utilise un serveur local comme ci-dessus.
- En cas d’avertissement ou de blocage, passe en **`embedMode: 'link'`** ou vérifie que l’URL (localhost vs 127.0.0.1) correspond à ce que tu as mis dans la barre d’adresse.

## Structure du dépôt

```
Live/
├── README.md
├── docs/
│   └── PAGES.md          # détail des fichiers et chemins
└── web/                  # site à déployer ou servir en local
    ├── index.html
    ├── css/styles.css
    ├── js/
    │   ├── config.js         # chaînes, embedMode, social
    │   ├── tailwind-config.js
    │   ├── streams.js        # lecteurs / mode lien
    │   └── site-common.js    # menu, footer, liens sociaux
    └── pages/
        ├── a-propos.html
        ├── reseaux.html
        ├── conditions.html
        ├── confidentialite.html
        └── dmca.html
```

## Documentation

- [`docs/PAGES.md`](docs/PAGES.md) — rôles des fichiers et conventions de chemins.

---

*Les flux vidéo et le chat sont fournis par Twitch ; PulseCast n’héberge pas la vidéo.*

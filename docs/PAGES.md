# Pages — PulseCast (site statique)

## Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `web/index.html` | Accueil : lecteurs Twitch (liste dans `web/js/config.js`). |
| `web/pages/*.html` | À propos, réseaux, conditions, confidentialité, DMCA. |
| `web/js/config.js` | `streamers`, `embedMode`, `social`, etc. |
| `web/js/streams.js` | Embeds Twitch (`Twitch.Embed`) ou mode lien + aperçu. |
| `web/js/site-common.js` | Menu mobile, liens sociaux, année du footer. |
| `web/js/tailwind-config.js` | Thème Tailwind CDN partagé. |
| `web/css/styles.css` | Styles complémentaires (live dot, cartes, pages légales). |

## Chaînes Twitch

Éditer uniquement **`web/js/config.js`** — pas de base de données ni d’API maison.

## Chemins relatifs

- Depuis **`web/index.html`** : `pages/nom.html`, `css/`, `js/`.
- Depuis **`web/pages/`** : `../index.html`, `../css/`, `../js/`.

## Prévisualisation

Servir le dossier **`web/`** en HTTP, par exemple :

```bash
npx --yes serve web -p 5173
```

Les embeds Twitch ne fonctionnent pas en ouverture directe `file://` sur le HTML.

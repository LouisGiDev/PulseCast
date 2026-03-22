# PulseCast — site (`web/`)

Ce dossier est le **site statique** complet : à servir ou à déployer tel quel (racine du domaine ou sous-dossier, selon ton hébergeur).

## Contenu

| Élément | Rôle |
|--------|------|
| `index.html` | Accueil : liste des chaînes + lecteurs Twitch. |
| `pages/*.html` | À propos, réseaux, CGU, confidentialité, DMCA. |
| `js/config.js` | **`streamers`**, **`embedMode`**, **`social`**, textes optionnels (`siteName`, `communityTagline`). |
| `js/streams.js` | Construction des embeds Twitch ou du mode « lien uniquement ». |
| `js/site-common.js` | Menu mobile, injection des URLs sociales, année du footer. |
| `js/tailwind-config.js` | Thème partagé (couleurs, polices, ombres) pour le CDN Tailwind. |
| `css/styles.css` | Compléments (animations live, typo pages légales). |

## Configuration

Fichier **`js/config.js`** (objet global `PULSECAST_CONFIG`) :

- **`streamers`** — tableau de `{ title, channel }` ; `channel` = pseudo Twitch (tu peux aussi coller une URL `twitch.tv/...`, normalisée côté script).
- **`embedMode`** — `'player'` ou `'link'` (voir README à la racine du dépôt).
- **`social`** — clés `discord`, `twitter`, `instagram`, `youtube` : URL complète ou chaîne vide.

## Local

Depuis la racine du dépôt :

```bash
npx --yes serve web -p 5173
```

Puis ouvre **http://localhost:5173**. Un serveur HTTP est **nécessaire** pour les embeds Twitch.

## Voir aussi

- [`../README.md`](../README.md) — vue d’ensemble du projet et déploiement.
- [`../docs/PAGES.md`](../docs/PAGES.md) — détail des pages et chemins relatifs.

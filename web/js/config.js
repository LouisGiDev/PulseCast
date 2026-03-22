/**
 * Configuration — liste des chaînes + mode d’affichage.
 * `channel` = pseudo Twitch (sans URL).
 */
window.PULSECAST_CONFIG = {
    siteName: 'PulseCast',
    communityTagline: 'Streams en direct de ta communauté',
    /**
     * Mode d’affichage du flux :
     * - 'player' : lecteur Twitch officiel (script embed/v1.js — recommandé, parent correct pour Firefox)
     * - 'link'   : pas d’iframe — image d’aperçu + bouton vers twitch.tv (jamais bloqué par le navigateur)
     */
    embedMode: 'player',
    streamers: [
        { title: 'Chaîne exemple', channel: 'twitch' },
        { title: 'Live de mickeltv1', channel: 'mickeltv1' },
        { title: 'Michou', channel: 'Michou' }
    ],
    social: {
        discord: '',
        twitter: '',
        instagram: '',
        youtube: ''
    }
};

const express = require('express');
const router = express.Router();
const verifyJWToken = require('../middleware/verifyJWToken.middleware');
const verifyAccessToken = require('../middleware/verifyAccessToken.middleware');
const SpotifyController = require('../module/spotify/SpotifyController');

router.get('/authorize', SpotifyController.authorize.bind(SpotifyController));

router.get('/redirect', SpotifyController.redirect.bind(SpotifyController));

router.get('/playlistFromTopArtists', verifyJWToken, verifyAccessToken, SpotifyController.getPlaylistFromTopArtists.bind(SpotifyController));

module.exports = router;
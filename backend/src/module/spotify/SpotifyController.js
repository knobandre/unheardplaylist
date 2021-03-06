const SpotifyLogic = require('./SpotifyLogic');
const AbstractController = require('../../core/logic/AbstractController');

class SpotifyController extends AbstractController {

    static get Logic() {
        return SpotifyLogic;
    }

    /**
     * Returns spotify's interface for the user to authenticate.
     */ 
    static async authorize(req, res) {
        res.send(await SpotifyLogic.getAuthorizationURI());
    }

    /**
     * Receives spotify's response for the user authentication.
     * @param req has authorization code and the sent state (from the authorize method) on the url query 
     */ 
    static redirect(req, res) {
        const {error} = req.query;
        error ? SpotifyLogic.handleAccessDenied(req.query, this.responseEmitter.bind(this, res)) 
        : SpotifyLogic.handleRedirect(req.query, this.responseEmitter.bind(this, res));
    }

    /**
     * Returns a randomly generated playlist based on the user's top artists. 
     */ 
    static getPlaylistFromTopArtists(req, res) {
        const {accessToken} = req.params;
        SpotifyLogic.getPlaylistFromTopArtists(accessToken, (result) => {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        });
    }

    /**
     * Returns a randomly generated playlist based on a single artist. 
     */ 
    static getPlaylistFromArtist(req, res) {
        const {accessToken, artistId} = req.params;
        SpotifyLogic.getPlaylistFromArtist(accessToken, artistId, (result) => {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        });
    }

    /**
     * Gets a previously database persisted playlist and creates it on the spotify account. 
     */ 
    static createPlaylist(req, res) {
        const {accessToken, id} = req.params;
        SpotifyLogic.createPlaylist(accessToken, id, req.body, (result) => {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        });
    }

    /**
     * Returns the results of a search. 
     */ 
    static search(req, res) {
        const {accessToken} = req.params;
        SpotifyLogic.search(accessToken, req.params.searchTerm, (result) => {
            const {status, ...rest} = result;
            const items = rest.data.artists.items.map(({id, name}) => ({id, name}));

            res.status(status).json(items);
        });
    }

    /**
     * Gets the spotify user's info.
     * @param string the spotify's generated access token for some user.
     * @param function a function to be called back with the user's info.
     */
    static getSpotifyUserInfo(req, res) {
        const {accessToken} = req.params;
        SpotifyLogic.getSpotifyUserInfo(accessToken, (result) => {
            const {status, ...rest} = result;
            
            res.status(status).json(rest);
        });
    }
    
    /**
     * A response emitter.
     * @param res the response object (from express' request handler) 
     * @param result the result object (from node's request call) 
     */ 
    static responseEmitter(res, result) {
        if (result.status !== 200) {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        }
        res.redirect(`${process.env.FRONTEND_ADDRESS}/authenticated/${result.jsonWebToken}`);
    }
}

module.exports = SpotifyController;
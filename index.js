'use strict';

const { send } = require('micro');
const { router, get } = require('microrouter');

const config = require('./config');
console.log(config)
const { spotifyService } = require('./services')(config);

const notfound = (_, res) => send(res, 404, 'Not found route');

const retrieveRandomMusic = async (_, res) =>
	spotifyService
		.getRecommandationAlbums()
		.then(tracks => send(res, 200, tracks))
        .catch(() => send(res, 500, 'Internal server error'));
        
const retrieveArtist = async (req, res) =>
	spotifyService
		.getArtist(req.params.id)
		.then(artist => send(res, 200, artist))
		.catch(() => send(res, 500, 'Internal server error'));

const routes = [get('/random', retrieveRandomMusic), get('/artist/:id', retrieveArtist),get('/*', notfound)];

module.exports = router(...routes);

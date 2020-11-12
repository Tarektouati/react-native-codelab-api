'use strict';

module.exports = config => ({
	spotifyService: require('./spotifyService')(config),
});

'use strict';

const env = require('common-env')();

module.exports = env.getOrElseAll({
	secrets: {
		client_id: '',
		client_secret: '',
	}
});
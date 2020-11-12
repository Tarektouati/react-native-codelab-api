'use strict';
const fetch = require('node-fetch');

module.exports = ({ secrets: { client_id, client_secret } }) => {
	return {
		async requestCredentialsToken() {
			
			const response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
					Authorization: `Basic ${Buffer.from(
						`${client_id}:${client_secret}`,
						'utf8'
					).toString('base64')}`,
				},
				body: new URLSearchParams({ grant_type: 'client_credentials' }),
			});
			const { token_type, access_token } = await response.json();
			return `${token_type} ${access_token}`;
		},

		async getRecommandationTracks() {
			const token = await this.requestCredentialsToken();
			const response = await fetch(
				'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_tracks=0c6xIDDpzE81m2q797ordA&min_energy=0.4&min_popularity=50&market=FR',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: token,
					},
				}
			);
			const { tracks } = await response.json();
			return tracks.map(({ album }) => album);
		},

		async getRecommandationAlbums() {
			const albums = await this.getRecommandationTracks();
			return albums.map((album) => ({
				id: album.id,
				images: album.images,
				name: album.name,
				release_date: album.release_date,
				artists: album.artists.map((atrist) => ({
					id: atrist.id,
					name: atrist.name,
				})),
			}));
		},

		async getArtist(artistId) {
			const token = await this.requestCredentialsToken();
			const response = await fetch(
				`https://api.spotify.com/v1/artists/${artistId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: token,
					},
				}
			);
			const albums = await this.getArtistAlbums(artistId);
			const { id, images, name } = await response.json();
			return { id, images, name, albums };
		},

		async getArtistAlbums(artistId) {
			const token = await this.requestCredentialsToken();
			const response = await fetch(
				`https://api.spotify.com/v1/artists/${artistId}/albums`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: token,
					},
				}
			);
			const { items: albums } = await response.json();
			return albums.map((album) => ({
				id: album.id,
				images: album.images,
				name: album.name,
				total_tracks: album.total_tracks,
				release_date: album.release_date,
				artists: album.artists.map((atrist) => ({
					id: atrist.id,
					name: atrist.name,
				})),
			}));
		},
	};
};

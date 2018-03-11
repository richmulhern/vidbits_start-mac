const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

const Video = require('../../models/video'); 

describe('Model: View', () => {
	describe('#title', () => {
		it('is a string', async () => {
			const titleAsInt = 1;

			const video = new Video({title: titleAsInt});

			assert.strictEqual(video.title, titleAsInt.toString());
		});

		it('is required', async () => {
			const video = new Video({url: 'https://www.youtube.com/watch?v=ULjCSK0oOlI'});
			video.validateSync();

  			assert.equal(video.errors.title.message, 'Title is required.');
		})
	});

	describe('#url', () => {
		it('is a string', async () => {
			const url = 1;
			
			const video = new Video({title: 'Test', url: url});

			assert.strictEqual(video.url, url.toString());
		});

		it('is required', async () => {
			const video = new Video({title: 'Title'});
			video.validateSync();

  			assert.equal(video.errors.url.message, 'URL is required.');
		})
	});
});
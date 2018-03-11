const {assert} = require('chai');
const {buildVideoObject, createVideo} = require('../test-utils');

describe('user visits the delete page', () => {
	describe('deletes video', () => {
		it('removes it from list', () => {
			const video = buildVideoObject();
			createVideo(video);

			browser.url('/');
			browser.click('.video-title a');
			browser.click('#delete');
			browser.url('/')

			assert.notInclude(browser.getText('#videos-container'), video.title);
		});
	});
});
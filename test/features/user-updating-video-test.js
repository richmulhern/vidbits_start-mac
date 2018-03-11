const {assert} = require('chai');
const {buildVideoObject, createVideo} = require('../test-utils');

describe('user visits the update page', () => {
	describe('update the video title', () => {
		it('save video with new title and display it', () => {
			const video = buildVideoObject();
			const newTitle = video.title + ' edit';
			createVideo(video);

			browser.click('#edit');
			browser.setValue('#title-input', newTitle);
			browser.click('button[type=submit]');

			assert.include(browser.getText('.video-title'), newTitle);
		});

		it('does not create a new video when updating', () => {
			const video = buildVideoObject();
			const newTitle = 'New Video Title!';
			createVideo(video);

			browser.click('#edit');
			browser.setValue('#title-input', newTitle);
			browser.click('button[type=submit]');
			browser.url('/videos');
			
			assert.notInclude(browser.getText('#videos-container'), video.title);
		});		
	});
});
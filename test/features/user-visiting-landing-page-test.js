const {assert} = require('chai');
const {buildVideoObject, createVideo} = require('../test-utils');

describe('user visits landing page', () => {
	describe('there are no videos yet', () => {
		it('videos-container should be empty', () => {
			browser.url('/');

			assert.equal(browser.getText('#videos-container'), '');
		})
	});

	describe('user can click the add video link', () => {
		it('takes them to the add create page', () => {
			browser.url('/');

			browser.click('a.add-video');

			assert.include(browser.getText('body'), 'Save a video');
		})
	});

	describe('user visits landing page with existing video', () => {
		it('should render video in iframe', () => {
			const video = buildVideoObject();

			createVideo(video);

			browser.url('/videos');

			assert.include(browser.getText('body'), video.title);
			assert.include(browser.getAttribute('iframe.video-player', 'src'), video.url);
		});

		it('can navigate to a video', () => {
			const video = buildVideoObject();

			createVideo(video);

			const videoUrl = browser.getUrl();

			browser.url('/videos');
			browser.click('.video-title a')

			assert.include(browser.getUrl(), videoUrl);
		});		
	});
})
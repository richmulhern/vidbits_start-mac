const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('user visits the create page', () => {
	describe('enter video data', () => {
		it('should redirect to / and show new video data', () => {
			const video = buildVideoObject();

			browser.url('/videos/create');
			browser.setValue('#title-input', video.title);
			browser.setValue('#description-input', video.description);
  			browser.setValue('#url-input', video.url);

			browser.click('button[type=submit]');

			assert.include(browser.getText('body'), video.title);
			assert.include(browser.getText('body'), video.description);		
		})
	})
})
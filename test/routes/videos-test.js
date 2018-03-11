const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const app = require('../../app');

const Video = require("../../models/video");

const {parseTextFromHTML, buildVideoObject} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos', () => {
	beforeEach(connectDatabase);
	afterEach(disconnectDatabase);

	describe('POST', () => {
		it('returns 302 status code and redirects to show page', async () => {
			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(buildVideoObject());

			const video = await Video.findOne({});

			assert.equal(response.status, 302);
			assert.equal(response.header.location, `videos/${video._id}`);
		});
	});

	describe('submit video with title and descriptions', () => {
		it('saves video correctly', async() => {
			const videoData = buildVideoObject();

			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(videoData);

			const video = await Video.findOne({});

			assert.equal(video.title, videoData.title);
			assert.equal(video.description, videoData.description);			
			assert.equal(video.url, videoData.url);
		});
	});

	describe('submit video without title', () => {
		it('should not save the video and display error message', async () => {
			const videoData = buildVideoObject();
			videoData.title = null;

			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(videoData);

			const videos = await Video.find({});

			assert.equal(videos.length, 0);
			assert.equal(response.status, 400);
			assert.equal(jsdom(response.text).querySelector("input#title-input").getAttribute('value'), '');
			assert.equal(jsdom(response.text).querySelector("textarea#description-input").textContent, videoData.description);
			assert.equal(jsdom(response.text).querySelector("input#url-input").getAttribute('value'), videoData.url);			
			assert.include(response.text, 'Title is required.');
		});
	});

	describe('submit video without url', () => {
		it('should not save the video and display error message', async () => {
			const videoData = buildVideoObject();
			videoData.url = null;

			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(videoData);

			const videos = await Video.find({});

			assert.equal(videos.length, 0);
			assert.equal(response.status, 400);
			assert.equal(jsdom(response.text).querySelector("input#title-input").getAttribute('value'), videoData.title);
			assert.equal(jsdom(response.text).querySelector("textarea#description-input").textContent, videoData.description);
			assert.equal(jsdom(response.text).querySelector("input#url-input").getAttribute('value'), '');			
			assert.include(response.text, 'URL is required.');
		});
	});	

	describe('GET', () => {
		it('lists video correctly', async () => {
			const videoData = buildVideoObject();

			const video = Video.create(videoData);

			const response = await request(app)
				.get('/videos');

			assert.include(parseTextFromHTML(response.text, `#videos-container`), videoData.title);
		});
	});

	describe('submit video with title and descriptions', () => {
		it('saves video correctly', async () => {
			const videoData = buildVideoObject();

			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(videoData);

			const video = await Video.findOne({});

			assert.equal(video.title, videoData.title);
			assert.equal(video.description, videoData.description);			
		});
	});	
});

describe('Server path: /videos/:id', () => {
	beforeEach(connectDatabase);
	afterEach(disconnectDatabase);

	describe('create video and go to detail page', () => {
		it('displays video correctly.', async () => {
			const videoData = buildVideoObject();
			const video = await Video.create(videoData);

			const response = await request(app)
				.get(`/videos/${video._id}`);

			assert.include(response.text, videoData.title);
			assert.equal(jsdom(response.text).querySelector('iframe.video-player').getAttribute('src'), video.url);
		});
	});
});

describe('Server path: /videos/:id/edit', () => {
	beforeEach(connectDatabase);
	afterEach(disconnectDatabase);

	describe('GET', () => {
		it('renders the form correctly', async () => {
			const videoData = buildVideoObject();
			const video = await Video.create(videoData);

			const response = await request(app)
				.get(`/videos/${video._id}/edit`);

			assert.equal(jsdom(response.text).querySelector('#title-input').getAttribute('value'), video.title);
			assert.equal(jsdom(response.text).querySelector('#description-input').textContent, video.description);
			assert.equal(jsdom(response.text).querySelector('#url-input').getAttribute('value'), video.url);
		});
	});
});

describe('Server path: /videos/:id/update', () => {
	beforeEach(connectDatabase);
	afterEach(disconnectDatabase);	

	describe('POST', () => {
		it('updates the video', async () => {
			const videoData = buildVideoObject();
			const video = await Video.create(videoData);

			const newVideoData = videoData;
			newVideoData.title = newVideoData.title + ' edit';

			const response = await request(app)
				.post(`/videos/${video._id}/updates`)
				.type('form')
				.send(newVideoData);

			const videoCheck = await Video.findOne({_id: video._id});

			assert.equal(videoCheck.title, newVideoData.title);
			assert.equal(response.status, 302);
			assert.equal(response.header.location, `/videos/${video._id}`);
		});

		it('does not update when title is empty', async () => {
			const videoData = buildVideoObject();
			const video = await Video.create(videoData);

			const response = await request(app)
				.post(`/videos/${video._id}/updates`)
				.type('form')
				.send({title: '', description: video.description, url: video.url});

			const videoCheck = await Video.findOne({_id: video._id});

			assert.equal(videoCheck.title, video.title);
			assert.equal(response.status, 400);			
			assert.equal(jsdom(response.text).querySelector('#title-input').getAttribute('value'), '');
			assert.equal(jsdom(response.text).querySelector('#description-input').textContent, video.description);
			assert.equal(jsdom(response.text).querySelector('#url-input').getAttribute('value'), video.url);			
		});

		it('does not update when url is empty', async () => {
			const videoData = buildVideoObject();
			const video = await Video.create(videoData);

			const response = await request(app)
				.post(`/videos/${video._id}/updates`)
				.type('form')
				.send({title: video.title, description: video.description, url: ''});

			const videoCheck = await Video.findOne({_id: video._id});

			assert.equal(videoCheck.url, video.url);
			assert.equal(response.status, 400);
			assert.equal(jsdom(response.text).querySelector('#title-input').getAttribute('value'), video.title);
			assert.equal(jsdom(response.text).querySelector('#description-input').textContent, video.description);
			assert.equal(jsdom(response.text).querySelector('#url-input').getAttribute('value'), '');			
		});

	});
});

describe('Server path: /videos/:id/delete', () => {
	beforeEach(connectDatabase);
	afterEach(disconnectDatabase);

	describe('POST', () => {
		it('deletes the video', async () => {
			const videoData = buildVideoObject();
			const video = await Video.create(videoData);

			const response = await request(app)
				.post(`/videos/${video._id}/delete`)
				.type('form')
				.send('');

			const videoCheck = await Video.findOne({_id: video._id});
			assert.equal(videoCheck, null);			
		});
	});
});

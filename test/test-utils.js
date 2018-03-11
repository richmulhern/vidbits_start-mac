const {jsdom} = require('jsdom');

const buildVideoObject = (options = {}) => {
  const title = options.title || 'My Video';
  const description = options.description || 'A great new video!';
  const url = options.url || 'https://www.youtube.com/watch?v=ULjCSK0oOlI';

  return {title, description, url};
}

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

// creates a video
const createVideo = (video) => {
  browser.url('/videos/create');
  browser.setValue('#title-input', video.title);
  browser.setValue('#url-input', video.url);
  browser.click('button[type=submit]');

  return browser;
}

module.exports = {
  buildVideoObject,
  parseTextFromHTML,
  createVideo
};

const router = require('express').Router();

const Video = require('../models/video'); 

router.get("/", (req, res, next) => {
    res.redirect("/videos")
})

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res, next) => {
  res.render('videos/create');
})

router.post('/videos', async (req, res, next) => {
  const {title, description, url} = req.body;
  const video = new Video({title, description, url});

  video.validateSync();

  if (video.errors) {
    res.status(400).render('videos/create', {errors: video.errors, video});
  } else {
    await video.save();
    res.redirect(`videos/${video._id}`);
  }
});

router.get('/videos/:id', async (req, res, next) => {
  const video = await Video.findOne({_id: req.params.id});
  res.render('videos/show', {video});
});

router.get('/videos/:id/edit', async (req, res, next) => {
  const video = await Video.findOne({_id: req.params.id});
  res.render('videos/edit', {video});
});

router.post('/videos/:id/updates', async (req, res, next) => {  
  const video = await Video.findOne({_id: req.params.id});

  video.title = req.body.title;
  video.description = req.body.description;
  video.url = req.body.url;

  video.validateSync();
  
  if (video.errors) {
    res.status(400).render('videos/edit', {errors: video.errors, video});
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.post('/videos/:id/delete', async (req, res, next) => {
  await Video.remove({_id: req.params.id}).exec();
  res.redirect('/');
});

module.exports = router;

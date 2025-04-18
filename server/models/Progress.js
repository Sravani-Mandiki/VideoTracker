
const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  watchedIntervals: [[Number]],
  lastWatchedPosition: Number,
  totalUniqueWatchedSeconds: Number,
  videoDuration: Number
});

module.exports = mongoose.model('Progress', ProgressSchema);

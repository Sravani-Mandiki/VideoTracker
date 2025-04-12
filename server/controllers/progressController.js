const Progress = require('../models/Progress');
const mergeIntervals = require('../utils/mergeIntervals');

exports.updateProgress = async (req, res) => {
  const { userId, videoId, newInterval, duration, currentTime } = req.body;

  let progressData = await Progress.findOne({ userId, videoId });

  if (!progressData) {
    progressData = new Progress({
      userId,
      videoId,
      videoDuration: duration,
      watchedIntervals: [newInterval],
      lastWatchedPosition: currentTime,
      totalUniqueWatchedSeconds: newInterval[1] - newInterval[0],
    });
  } else {
    const videoDuration = progressData.videoDuration || duration || 1;

  const clampedInterval = [
    Math.max(0, Math.min(newInterval[0], videoDuration)),
    Math.max(0, Math.min(newInterval[1], videoDuration)),
  ];

  if (clampedInterval[0] >= clampedInterval[1]) {
    return res.status(400).json({ error: 'Invalid watched interval' });
  }

  const intervals = [...progressData.watchedIntervals, clampedInterval];

    const merged = mergeIntervals(intervals);
    const uniqueSeconds = merged.reduce((acc, [s, e]) => acc + (e - s), 0);

    progressData.watchedIntervals = merged;
    progressData.totalUniqueWatchedSeconds = uniqueSeconds;
    progressData.lastWatchedPosition = currentTime;

    if (!progressData.videoDuration && duration) {
      progressData.videoDuration = duration;
    }
  }

  await progressData.save();

  const videoDuration = progressData.videoDuration || 1; 
  const cappedProgress = Math.min(
    (progressData.totalUniqueWatchedSeconds / videoDuration) * 100,
    100
  ).toFixed(2);

  res.json({
    mergedIntervals: progressData.watchedIntervals,
    progress: cappedProgress,
  });
};

exports.getProgress = async (req, res) => {
  const { userId, videoId } = req.params;
  const progressData = await Progress.findOne({ userId, videoId });

  if (!progressData) {
    return res.json({
      mergedIntervals: [],
      progress: 0,
      lastWatchedPosition: 0,
    });
  }

  const videoDuration = progressData.videoDuration || 1;
  const cappedProgress = Math.min(
    (progressData.totalUniqueWatchedSeconds / videoDuration) * 100,
    100
  ).toFixed(2);

  res.json({
    mergedIntervals: progressData.watchedIntervals,
    progress: cappedProgress,
    lastWatchedPosition: progressData.lastWatchedPosition,
  });
};

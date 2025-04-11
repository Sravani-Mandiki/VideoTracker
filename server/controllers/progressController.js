
const Progress = require('../models/Progress');
const mergeIntervals = require('../utils/mergeIntervals');

exports.updateProgress = async (req, res) => {
  const { userId, videoId, newInterval, duration, currentTime } = req.body;

  let progressData = await Progress.findOne({ userId, videoId });
  if (!progressData) {
    progressData = new Progress({
      userId,
      videoId,
      watchedIntervals: [newInterval],
      lastWatchedPosition: currentTime,
      totalUniqueWatchedSeconds: newInterval[1] - newInterval[0],
    });
  } else {
    const intervals = [...progressData.watchedIntervals, newInterval];
    const merged = mergeIntervals(intervals);
    const uniqueSeconds = merged.reduce((acc, [s, e]) => acc + (e - s), 0);
    
    progressData.watchedIntervals = merged;
    progressData.totalUniqueWatchedSeconds = uniqueSeconds;
    progressData.lastWatchedPosition = currentTime;
  }

  await progressData.save();

  res.json({
    mergedIntervals: progressData.watchedIntervals,
    progress: ((progressData.totalUniqueWatchedSeconds / duration) * 100).toFixed(2),
  });
};

exports.getProgress = async (req, res) => {
  const { userId, videoId } = req.params;
  const progressData = await Progress.findOne({ userId, videoId });

  if (!progressData) {
    return res.json({ mergedIntervals: [], progress: 0, lastWatchedPosition: 0 });
  }

  const progress = (
    (progressData.totalUniqueWatchedSeconds / 100) * 100
  ).toFixed(2);

  res.json({
    mergedIntervals: progressData.watchedIntervals,
    progress,
    lastWatchedPosition: progressData.lastWatchedPosition,
  });
};

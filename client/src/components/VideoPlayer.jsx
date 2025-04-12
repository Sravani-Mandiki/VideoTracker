
import React, { useRef, useState, useEffect } from 'react';
import axios from '../services/api';

const VideoPlayer = ({ userId, videoId }) => {
  const videoRef = useRef(null);
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = () => {
    const currentTime = Math.floor(videoRef.current.currentTime);

    if (!currentInterval) {
      setCurrentInterval([currentTime, currentTime]);
    } else {
      setCurrentInterval([currentInterval[0], currentTime]);
    }
  };

  const handlePause = async () => {
    if (currentInterval && currentInterval[1] > currentInterval[0]) {
      const updatedIntervals = [...watchedIntervals, currentInterval];
      const res = await axios.post('/update', {
        userId,
        videoId,
        newInterval: currentInterval,
        duration: Math.floor(videoRef.current.duration),
        currentTime: Math.floor(videoRef.current.currentTime)
      });

      setWatchedIntervals(res.data.mergedIntervals);
      setProgress(res.data.progress);
      setCurrentInterval(null);
    }
  };

  const fetchProgress = async () => {
    const res = await axios.get(`/${userId}/${videoId}`);
    const { mergedIntervals, progress, lastWatchedPosition } = res.data;
    setWatchedIntervals(mergedIntervals);
    setProgress(progress);
    if (videoRef.current) videoRef.current.currentTime = lastWatchedPosition;
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        src="/large2.mp4"
        controls
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onEnded={handlePause}
        width="600"
      />
      <p>Progress: {progress}%</p>
    </div>
  );
};

export default VideoPlayer;

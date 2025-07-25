import React, { useEffect, useState } from "react";
import "./styles/SessionDuration.css";

const SessionDuration = () => {
  const [sessionDuration, setSessionDuration] = useState(0);
  const [displayedDuration, setDisplayedDuration] = useState(0); // State for the animated number

  useEffect(() => {
    const fetchSessionDuration = () => {
      let duration = localStorage.getItem("sessionDuration");
      if (!duration) {
        duration = (Math.random() * 9 + 1).toFixed(1); // Random number between 1 and 10 minutes
        localStorage.setItem("sessionDuration", duration);
      }
      setSessionDuration(parseFloat(duration));
    };

    fetchSessionDuration();
  }, []);

  useEffect(() => {
    let animationFrameId;
    let startTime;
    const duration = 2000; // Duration of the animation in milliseconds
    const startValue = displayedDuration;
    const endValue = sessionDuration;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp; // Initialize start time
      const elapsedTime = timestamp - startTime;

      // Calculate progress as a percentage
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function (easeOutQuad)
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      // Calculate current value based on eased progress
      const currentValue = parseFloat(
        (startValue + (endValue - startValue) * easedProgress).toFixed(1)
      );

      setDisplayedDuration(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount); // Continue animating
      } else {
        setDisplayedDuration(endValue); // Ensure we end at the correct number
      }
    };

    animationFrameId = requestAnimationFrame(animateCount); // Start the animation

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [sessionDuration]);

  return (
    <div className="session-duration">
      <h2 className="heading-primary">Average Session Duration</h2>
      <p className="text-large">{displayedDuration} minutes</p>
    </div>
  );
};

export default SessionDuration;

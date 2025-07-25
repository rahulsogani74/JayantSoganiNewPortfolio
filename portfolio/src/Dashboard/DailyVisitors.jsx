import React, { useEffect, useState } from "react";
import "./styles/DailyVisitors.css";

const DailyVisitors = () => {
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [displayedVisitors, setDisplayedVisitors] = useState(0); // State for the animated number

  useEffect(() => {
    const fetchDailyVisitors = () => {
      let visitors = localStorage.getItem("dailyVisitors");
      if (!visitors) {
        visitors = Math.floor(Math.random() * 100 + 50); // Random number between 50 and 150
        localStorage.setItem("dailyVisitors", visitors);
      }
      setDailyVisitors(parseInt(visitors));
    };

    fetchDailyVisitors();
  }, []);

  useEffect(() => {
    let animationFrameId;
    let startTime;
    const duration = 2000; // Duration of the animation in milliseconds
    const startValue = displayedVisitors;
    const endValue = dailyVisitors;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp; // Initialize start time
      const elapsedTime = timestamp - startTime;

      // Calculate progress as a percentage
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function (easeOutQuad)
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      // Calculate current value based on eased progress
      const currentValue = Math.round(
        startValue + (endValue - startValue) * easedProgress
      );

      setDisplayedVisitors(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount); // Continue animating
      } else {
        setDisplayedVisitors(endValue); // Ensure we end at the correct number
      }
    };

    animationFrameId = requestAnimationFrame(animateCount); // Start the animation

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [dailyVisitors]);

  return (
    <div className="daily-visitors">
      <h2 className="heading-primary">Daily Visitors</h2>
      <p className="text-large">{displayedVisitors} visitors</p>
    </div>
  );
};

export default DailyVisitors;

import React, { useEffect, useState } from "react";

const HorizontalBar = ({ percent, duration = 1200 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const next = Math.min(percent, Math.round((elapsed / duration) * percent));
      setProgress(next);
      if (next < percent) {
        requestAnimationFrame(animate);
      }
    };
    setProgress(0);
    requestAnimationFrame(animate);
  }, [percent, duration]);

  return (
    <div className="horizontal-bar">
      <div
        className="horizontal-bar-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default HorizontalBar;

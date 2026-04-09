import { useState } from "react";
import "./style.css";
import { useHaptic } from "use-haptic";

export const HapticButton = () => {
  const [isContinuous, setIsContinuous] = useState(false);
  const [duration, setDuration] = useState(5000);
  const [interval, setInterval] = useState(100);
  const { ref } = useHaptic();
  const { triggerHaptic } = useHaptic();

  const handleLegacyClick = () => {
    if (isContinuous) {
      const startTime = Date.now();

      const continuousVibration = () => {
        if (Date.now() - startTime < duration) {
          triggerHaptic();
          setTimeout(continuousVibration, interval);
        }
      };

      continuousVibration();
    } else {
      triggerHaptic();
    }
  };

  return (
    <div className="haptic-btn-container">
      <button
        className="haptic-btn"
        onClick={() => console.log("ref-based haptic target")}
        ref={ref}
        type="button"
      >
        iOS Ref Haptic
      </button>
      <button
        className="haptic-btn legacy-btn"
        onClick={handleLegacyClick}
        type="button"
      >
        Android triggerHaptic()
      </button>
      <label>
        <input
          type="checkbox"
          checked={isContinuous}
          onChange={() => setIsContinuous((prev) => !prev)}
        />
        Continuous Haptic
      </label>
      <label>
        Duration (ms):
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </label>
      <label>
        Interval (ms):
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
        />
      </label>
    </div>
  );
};

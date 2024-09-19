import { useState } from "react";
import "./style.css";
import { useHaptic } from "use-haptic";

export const VibrationButton = () => {
  const [isContinuous, setIsContinuous] = useState(false);
  const [duration, setDuration] = useState(5000);
  const [interval, setInterval] = useState(100);
  const { vibe } = useHaptic();

  const handleClick = () => {
    if (isContinuous) {
      const startTime = Date.now();

      const continuousVibration = () => {
        if (Date.now() - startTime < duration) {
          vibe();
          setTimeout(continuousVibration, interval);
        }
      };

      continuousVibration();
    } else {
      vibe();
    }
  };

  return (
    <div className="haptic-btn-container">
      <button className="haptic-btn" onClick={handleClick}>
        Feel Vibration !!!
      </button>
      <label>
        <input type="checkbox" checked={isContinuous} onChange={() => setIsContinuous((prev) => !prev)} />
        Continuous Vibration
      </label>
      <label>
        Duration (ms):
        <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
      </label>
      <label>
        Interval (ms):
        <input type="number" value={interval} onChange={(e) => setInterval(Number(e.target.value))} />
      </label>
    </div>
  );
};

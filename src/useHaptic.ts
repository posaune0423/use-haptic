import { useCallback, useEffect, useRef } from "react";

const useHaptic = (): { vibe: () => void } => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    // Create and append input element
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "haptic-switch";
    input.setAttribute("switch", "");
    input.style.display = "none";
    document.body.appendChild(input);
    inputRef.current = input;

    // Create and append label element
    const label = document.createElement("label");
    label.htmlFor = "haptic-switch";
    label.style.display = "none";
    document.body.appendChild(label);
    labelRef.current = label;

    // Cleanup function
    return () => {
      document.body.removeChild(input);
      document.body.removeChild(label);
    };
  }, []);

  const vibe = useCallback(() => {
    if (labelRef.current) {
      labelRef.current.click();
    }
  }, []);

  return { vibe };
};

export default useHaptic;

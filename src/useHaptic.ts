import { useCallback, useEffect, useMemo, useState } from "react";
import { detectiOS } from "./utils.ts";

const HAPTIC_DURATION = 5;
const OVERLAY_DATA_ATTRIBUTE = "data-use-haptic-overlay";
const OVERLAY_Z_INDEX = "2147483647";

type HapticTarget = HTMLElement & { disabled?: boolean; click: () => void };

export type UseHapticResult = {
  ref: (node: HTMLElement | null) => void;
  triggerHaptic: () => void;
};

const isTargetEligible = (target: HapticTarget): boolean => {
  if (!document.body.contains(target)) {
    return false;
  }

  if ("disabled" in target && Boolean(target.disabled)) {
    return false;
  }

  if (target.getAttribute("aria-hidden") === "true") {
    return false;
  }

  const computedStyle = globalThis.getComputedStyle(target);
  if (
    computedStyle.display === "none" ||
    computedStyle.visibility === "hidden" ||
    computedStyle.pointerEvents === "none"
  ) {
    return false;
  }

  const rect = target.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const hideOverlay = (input: HTMLInputElement) => {
  input.style.display = "none";
  input.style.pointerEvents = "none";
};

const syncOverlayPosition = (
  input: HTMLInputElement,
  target: HapticTarget,
) => {
  if (!isTargetEligible(target)) {
    hideOverlay(input);
    return;
  }

  const rect = target.getBoundingClientRect();
  input.style.position = "fixed";
  input.style.left = `${rect.left}px`;
  input.style.top = `${rect.top}px`;
  input.style.width = `${rect.width}px`;
  input.style.height = `${rect.height}px`;
  input.style.margin = "0";
  input.style.opacity = "0";
  input.style.pointerEvents = "auto";
  input.style.display = "block";
  input.style.cursor = globalThis.getComputedStyle(target).cursor || "auto";
  input.style.zIndex = OVERLAY_Z_INDEX;
};

/**
 * React hook for mobile haptic feedback.
 *
 * On iOS Safari, attach `ref` to the pressed element so the hook can place a
 * transparent native `input[switch]` over it. On Android and other browsers,
 * `triggerHaptic()` continues to use the Vibration API programmatically.
 */
export const useHaptic = (
  duration = HAPTIC_DURATION,
): UseHapticResult => {
  const [target, setTarget] = useState<HapticTarget | null>(null);
  const isIOS = useMemo(() => detectiOS(), []);

  const ref = useCallback((node: HTMLElement | null) => {
    setTarget(node as HapticTarget | null);
  }, []);

  useEffect(() => {
    if (!isIOS || !target) {
      return;
    }

    const input = document.createElement("input");
    input.type = "checkbox";
    input.tabIndex = -1;
    input.setAttribute("switch", "");
    input.setAttribute("aria-hidden", "true");
    input.setAttribute(OVERLAY_DATA_ATTRIBUTE, "true");
    document.body.appendChild(input);

    const sync = () => syncOverlayPosition(input, target);
    const handleOverlayClick = (event: Event) => {
      event.preventDefault();
      target.click();
    };

    input.addEventListener("click", handleOverlayClick);

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(sync)
      : null;
    resizeObserver?.observe(target);

    const mutationObserver = typeof MutationObserver !== "undefined"
      ? new MutationObserver(sync)
      : null;
    mutationObserver?.observe(target, {
      attributes: true,
      childList: false,
      subtree: false,
    });

    globalThis.addEventListener("scroll", sync, true);
    globalThis.addEventListener("resize", sync);

    sync();

    return () => {
      globalThis.removeEventListener("scroll", sync, true);
      globalThis.removeEventListener("resize", sync);
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      input.removeEventListener("click", handleOverlayClick);
      input.remove();
    };
  }, [isIOS, target]);

  const triggerHaptic = useCallback(() => {
    if (!isIOS && navigator?.vibrate) {
      navigator.vibrate(duration);
    }
  }, [duration, isIOS]);

  return { ref, triggerHaptic };
};

export default useHaptic;

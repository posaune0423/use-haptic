import jsdom from "global-jsdom";
jsdom();

import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { act, renderHook } from "@testing-library/react";
import useHaptic from "../src/useHaptic.ts";

const OVERLAY_SELECTOR = "input[data-use-haptic-overlay='true']";

const setUserAgent = (value: string) => {
  Object.defineProperty(globalThis.navigator, "userAgent", {
    configurable: true,
    value,
  });
};

const mockRect = (element: HTMLElement) => {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      bottom: 60,
      height: 40,
      left: 10,
      right: 110,
      top: 20,
      width: 100,
      x: 10,
      y: 20,
      toJSON: () => "",
    }),
  });
};

describe("useHaptic", () => {
  it("creates an iOS overlay for the referenced target and forwards clicks", () => {
    const originalUserAgent = globalThis.navigator.userAgent;
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    );

    const target = document.createElement("button");
    document.body.appendChild(target);
    mockRect(target);

    const targetClickSpy = spy(target, "click");

    try {
      const { result, unmount } = renderHook(() => useHaptic());

      act(() => {
        result.current.ref(target);
      });

      const overlay = document.querySelector(OVERLAY_SELECTOR) as
        | HTMLInputElement
        | null;
      if (!overlay) {
        throw new Error("overlay not found");
      }

      assertEquals(overlay.getAttribute("switch"), "");
      assertEquals(overlay.style.position, "fixed");
      assertEquals(overlay.style.left, "10px");
      assertEquals(overlay.style.top, "20px");
      assertEquals(overlay.style.width, "100px");
      assertEquals(overlay.style.height, "40px");
      assertEquals(overlay.style.opacity, "0");
      assertEquals(overlay.style.pointerEvents, "auto");

      overlay.click();
      assertSpyCalls(targetClickSpy, 1);

      unmount();
      assertEquals(document.querySelector(OVERLAY_SELECTOR), null);
    } finally {
      targetClickSpy.restore();
      target.remove();
      setUserAgent(originalUserAgent);
    }
  });

  it("does not create an iOS overlay for a hidden target", () => {
    const originalUserAgent = globalThis.navigator.userAgent;
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    );

    const target = document.createElement("div");
    target.style.display = "none";
    document.body.appendChild(target);
    mockRect(target);

    try {
      const { result, unmount } = renderHook(() => useHaptic());

      act(() => {
        result.current.ref(target);
      });

      const overlay = document.querySelector(OVERLAY_SELECTOR) as
        | HTMLInputElement
        | null;
      if (!overlay) {
        throw new Error("overlay not found");
      }

      assertEquals(overlay.style.display, "none");
      assertEquals(overlay.style.pointerEvents, "none");
      unmount();
      assertEquals(document.querySelector(OVERLAY_SELECTOR), null);
    } finally {
      target.remove();
      setUserAgent(originalUserAgent);
    }
  });

  it("uses navigator.vibrate on non-iOS when triggerHaptic() is called", () => {
    const originalUserAgent = globalThis.navigator.userAgent;
    const originalVibrate = navigator.vibrate;
    setUserAgent("Mozilla/5.0 (Linux; Android 15)");

    navigator.vibrate = (() => true) as typeof navigator.vibrate;
    const vibrateSpy = spy(navigator, "vibrate");

    try {
      const { result } = renderHook(() => useHaptic());

      result.current.triggerHaptic();

      assertSpyCalls(vibrateSpy, 1);
      assertEquals(vibrateSpy.calls[0].args[0] as unknown, 5);
      assertEquals(document.querySelector(OVERLAY_SELECTOR), null);
    } finally {
      vibrateSpy.restore();
      navigator.vibrate = originalVibrate;
      setUserAgent(originalUserAgent);
    }
  });
});

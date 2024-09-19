import { act, renderHook } from "@testing-library/react";
import useHaptic from "../src/useHaptic";

describe("useHaptic", () => {
  beforeEach(() => {
    jest.spyOn(document.body, "appendChild");
    jest.spyOn(document.body, "removeChild");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should append elements on mount and remove them on unmount", () => {
    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");

    const { unmount } = renderHook(() => useHaptic());

    expect(appendChildSpy).toHaveBeenCalledTimes(3);
    expect((appendChildSpy.mock.calls[0][0] as HTMLElement).tagName).toBe(
      "DIV",
    ); // React appends this
    expect((appendChildSpy.mock.calls[1][0] as HTMLElement).tagName).toBe(
      "INPUT",
    );
    expect((appendChildSpy.mock.calls[2][0] as HTMLElement).tagName).toBe(
      "LABEL",
    );

    unmount();

    expect(removeChildSpy).toHaveBeenCalledTimes(2);
  });

  test("should trigger label click when vibe is called", () => {
    const labelClickMock = jest.fn();

    // Render the hook
    const { result } = renderHook(() => useHaptic());

    // Find the label element appended to the document body
    const label = document.querySelector(
      'label[for="haptic-switch"]',
    ) as HTMLLabelElement | null;

    // Ensure the label exists
    expect(label).not.toBeNull();

    if (label) {
      // Spy on the label's click method
      jest.spyOn(label, "click").mockImplementation(labelClickMock);
    }

    // Call the vibe function
    act(() => {
      result.current.vibe();
    });

    // Assert that the click method was called
    expect(labelClickMock).toHaveBeenCalled();

    // Restore all mocks
    jest.restoreAllMocks();
  });
});

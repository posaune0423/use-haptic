/**
 * use-haptic
 *
 * A React hook library that provides haptic feedback functionality for mobile
 * web applications.
 *
 * On iOS Safari, attach the returned `ref` to the pressed element so the hook
 * can place a native `input[switch]` over it. On Android and other browsers,
 * `triggerHaptic()` uses the Vibration API.
 *
 * @example
 * ```tsx
 * import { useHaptic } from "use-haptic";
 *
 * function HapticButton() {
 *   const { ref } = useHaptic();
 *
 *   return (
 *     <button ref={ref} type="button">
 *       Haptic
 *     </button>
 *   );
 * }
 * ```
 */

export * from "./useHaptic.ts";

import { describe, expect, it } from "vitest";
import {
  easeInOutCubic,
  getContinuousScrollTop,
  getNextAutoScrollIndex,
  getSmoothScrollTop,
  shouldToggleAutoScrollFromClick,
  shouldStartAutoScroll,
} from "./invitation-experience";

describe("invitation experience helpers", () => {
  it("starts auto-scroll only after opening and when reduced motion is off", () => {
    expect(shouldStartAutoScroll({ isOpened: false, prefersReducedMotion: false })).toBe(
      false,
    );
    expect(shouldStartAutoScroll({ isOpened: true, prefersReducedMotion: true })).toBe(
      false,
    );
    expect(shouldStartAutoScroll({ isOpened: true, prefersReducedMotion: false })).toBe(
      true,
    );
  });

  it("advances through section indexes and stops after the final section", () => {
    expect(getNextAutoScrollIndex({ currentIndex: -1, sectionCount: 4 })).toBe(0);
    expect(getNextAutoScrollIndex({ currentIndex: 1, sectionCount: 4 })).toBe(2);
    expect(getNextAutoScrollIndex({ currentIndex: 3, sectionCount: 4 })).toBeNull();
  });

  it("eases scroll progress for softer automatic scrolling", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
    expect(getSmoothScrollTop({ start: 100, target: 500, progress: 0.5 })).toBe(300);
  });

  it("calculates continuous scroll progress without overshooting the page bottom", () => {
    expect(
      getContinuousScrollTop({
        current: 100,
        deltaMs: 1000,
        pixelsPerSecond: 40,
        max: 500,
      }),
    ).toBe(140);
    expect(
      getContinuousScrollTop({
        current: 490,
        deltaMs: 1000,
        pixelsPerSecond: 40,
        max: 500,
      }),
    ).toBe(500);
  });

  it("toggles auto-scroll on page clicks but ignores interactive controls", () => {
    expect(shouldToggleAutoScrollFromClick({ isInteractiveTarget: false })).toBe(true);
    expect(shouldToggleAutoScrollFromClick({ isInteractiveTarget: true })).toBe(false);
  });
});

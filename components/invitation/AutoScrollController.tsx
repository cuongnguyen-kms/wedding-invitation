"use client";

import { useEffect, useRef, useState } from "react";
import {
  getContinuousScrollTop,
  shouldPauseFromTouchMove,
  shouldToggleAutoScrollFromClick,
  shouldStartAutoScroll,
} from "@/lib/invitation-experience";

const TOUCH_MOVE_PAUSE_THRESHOLD_PX = 10;

type AutoScrollControllerProps = {
  isOpened: boolean;
};

// TEMPORARY: an on-screen readout for diagnosing the "doesn't auto-scroll
// on real phones" bug without needing a Mac + Safari Web Inspector. Only
// renders when the page is loaded with ?debug=1. Remove once the bug is
// confirmed fixed on real hardware.
function isDebugMode() {
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'a, button, input, select, textarea, label, summary, [role="button"], [contenteditable="true"]',
    ),
  );
}

function getMaxScrollTop() {
  return Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0,
  );
}

export function AutoScrollController({ isOpened }: AutoScrollControllerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const previousTimeRef = useRef<number | null>(null);
  const targetScrollTopRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const debugEnabledRef = useRef(false);
  const [debugLine, setDebugLine] = useState("");

  useEffect(() => {
    const enabled = isDebugMode();
    debugEnabledRef.current = enabled;
    // Reading a URL query param can only happen client-side after mount, so
    // this can't be derived during render - the setState-in-effect lint rule
    // doesn't apply to genuinely external, un-SSR-able state like this.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDebugEnabled(enabled);
  }, []);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!isOpened) {
      return;
    }

    const pauseAutoScroll = (reason: string) => {
      isPausedRef.current = true;
      setIsPaused(true);
      if (debugEnabledRef.current) {
        setDebugLine(`paused by: ${reason}`);
      }
    };
    const toggleAutoScroll = (event: MouseEvent) => {
      if (
        shouldToggleAutoScrollFromClick({
          isInteractiveTarget: isInteractiveElement(event.target),
        })
      ) {
        setIsPaused((current) => {
          const next = !current;
          isPausedRef.current = next;
          previousTimeRef.current = null;
          targetScrollTopRef.current = null;
          return next;
        });
      }
    };
    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };
    // Real touchscreens report a handful of low-amplitude touchmove events
    // for a stationary tap (finger jitter while pressing "Open Invitation"),
    // which used to pause auto-scroll before it ever started. Only treat a
    // touchmove as a deliberate scroll gesture once it clears a small
    // threshold from where the touch began.
    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (
        currentY !== undefined &&
        shouldPauseFromTouchMove({
          startY: touchStartYRef.current,
          currentY,
          thresholdPx: TOUCH_MOVE_PAUSE_THRESHOLD_PX,
        })
      ) {
        pauseAutoScroll(
          `touchmove (start=${touchStartYRef.current} current=${currentY})`,
        );
      }
    };
    const handleWheel = () => pauseAutoScroll("wheel");
    const handleKeydown = () => pauseAutoScroll("keydown");

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeydown, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("click", toggleAutoScroll);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", toggleAutoScroll);
    };
  }, [isOpened]);

  useEffect(() => {
    const started = shouldStartAutoScroll({
      isOpened,
      prefersReducedMotion: prefersReducedMotion(),
    });
    if (debugEnabledRef.current) {
      setDebugLine(
        `gate: started=${started} isOpened=${isOpened} isPaused=${isPaused}`,
      );
    }

    if (!started || isPaused) {
      return;
    }

    let frameId = 0;
    let frameCount = 0;
    const pixelsPerSecond = 34;

    function step(now: number) {
      if (isPausedRef.current) {
        return;
      }

      frameCount += 1;
      const previousTime = previousTimeRef.current ?? now;
      const deltaMs = now - previousTime;
      previousTimeRef.current = now;
      const max = getMaxScrollTop();
      // Debug data from a real iPhone 13/Chrome session showed scrollY
      // reading back as 0 forever even after 500+ frames of writes: each
      // frame's step is under 1px, and this device never reflects that
      // write back through window.scrollY by the time the next frame reads
      // it, so basing the next step on a DOM readback stalls permanently.
      // Tracking the intended position ourselves guarantees it keeps
      // growing every frame regardless of what the DOM reports back, so
      // the accumulated delta eventually becomes large enough that the
      // browser can't ignore it.
      const baseline = targetScrollTopRef.current ?? window.scrollY;
      const nextTop = getContinuousScrollTop({
        current: baseline,
        deltaMs,
        pixelsPerSecond,
        max,
      });
      targetScrollTopRef.current = nextTop;

      // Assigning scrollTop directly is always instant, unlike scrollTo's
      // options-object form, which defers to the html { scroll-behavior:
      // smooth } rule in globals.css. documentElement and body are both
      // written since browsers have differed on which is "the" scrolling
      // element for the top-level document.
      document.documentElement.scrollTop = nextTop;
      document.body.scrollTop = nextTop;

      if (debugEnabledRef.current) {
        setDebugLine(
          `frame#${frameCount} scrollY=${Math.round(window.scrollY)} target=${nextTop} max=${max} innerH=${window.innerHeight} docH=${document.documentElement.scrollHeight}`,
        );
      }

      if (nextTop < max) {
        frameId = window.requestAnimationFrame(step);
      } else if (debugEnabledRef.current) {
        setDebugLine((current) => `${current} [stopped: reached max]`);
      }
    }

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isOpened, isPaused]);

  if (!debugEnabled) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        color: "#7CFC00",
        fontFamily: "monospace",
        fontSize: 11,
        lineHeight: 1.4,
        padding: "6px 8px",
        whiteSpace: "pre-wrap",
        pointerEvents: "none",
      }}
    >
      {debugLine || "waiting for first update..."}
    </div>
  );
}

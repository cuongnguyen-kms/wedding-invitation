"use client";

import { useEffect, useRef, useState } from "react";
import {
  getContinuousScrollTop,
  shouldToggleAutoScrollFromClick,
  shouldStartAutoScroll,
} from "@/lib/invitation-experience";

type AutoScrollControllerProps = {
  isOpened: boolean;
};

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

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!isOpened) {
      return;
    }

    const pauseAutoScroll = () => {
      isPausedRef.current = true;
      setIsPaused(true);
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
          return next;
        });
      }
    };
    const events: Array<keyof WindowEventMap> = [
      "wheel",
      "touchmove",
      "keydown",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, pauseAutoScroll, { passive: true });
    });
    window.addEventListener("click", toggleAutoScroll);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, pauseAutoScroll);
      });
      window.removeEventListener("click", toggleAutoScroll);
    };
  }, [isOpened]);

  useEffect(() => {
    if (
      !shouldStartAutoScroll({
        isOpened,
        prefersReducedMotion: prefersReducedMotion(),
      }) ||
      isPaused
    ) {
      return;
    }

    let frameId = 0;
    const pixelsPerSecond = 34;

    function step(now: number) {
      if (isPausedRef.current) {
        return;
      }

      const previousTime = previousTimeRef.current ?? now;
      const deltaMs = now - previousTime;
      previousTimeRef.current = now;
      const nextTop = getContinuousScrollTop({
        current: window.scrollY,
        deltaMs,
        pixelsPerSecond,
        max: getMaxScrollTop(),
      });

      // Not window.scrollTo({ behavior: "auto" }): "auto" defers to the
      // html { scroll-behavior: smooth } rule in globals.css, so each ~16ms
      // frame would restart a smooth-scroll animation before the previous
      // one (a sub-pixel step) finished - net movement rounds to ~0 on
      // stricter engines (mobile WebKit) even though it limps along on
      // desktop. Assigning scrollTop directly always jumps instantly,
      // bypassing scroll-behavior entirely.
      document.documentElement.scrollTop = nextTop;

      if (nextTop < getMaxScrollTop()) {
        frameId = window.requestAnimationFrame(step);
      }
    }

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isOpened, isPaused]);

  return null;
}

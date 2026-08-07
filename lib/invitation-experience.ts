type AutoScrollState = {
  isOpened: boolean;
  prefersReducedMotion: boolean;
};

type NextAutoScrollIndexInput = {
  currentIndex: number;
  sectionCount: number;
};

type SmoothScrollTopInput = {
  start: number;
  target: number;
  progress: number;
};

type ContinuousScrollTopInput = {
  current: number;
  deltaMs: number;
  pixelsPerSecond: number;
  max: number;
};

type AutoScrollClickInput = {
  isInteractiveTarget: boolean;
};

type TouchPauseInput = {
  startY: number | null;
  currentY: number;
  thresholdPx: number;
};

export function shouldStartAutoScroll({
  isOpened,
  prefersReducedMotion,
}: AutoScrollState) {
  return isOpened && !prefersReducedMotion;
}

export function getNextAutoScrollIndex({
  currentIndex,
  sectionCount,
}: NextAutoScrollIndexInput) {
  const nextIndex = currentIndex + 1;

  if (nextIndex >= sectionCount) {
    return null;
  }

  return nextIndex;
}

export function easeInOutCubic(progress: number) {
  if (progress <= 0) {
    return 0;
  }

  if (progress >= 1) {
    return 1;
  }

  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function getSmoothScrollTop({
  start,
  target,
  progress,
}: SmoothScrollTopInput) {
  return Math.round(start + (target - start) * easeInOutCubic(progress));
}

export function getContinuousScrollTop({
  current,
  deltaMs,
  pixelsPerSecond,
  max,
}: ContinuousScrollTopInput) {
  const next = current + (pixelsPerSecond * deltaMs) / 1000;
  return Math.min(Math.round(next), max);
}

export function shouldToggleAutoScrollFromClick({
  isInteractiveTarget,
}: AutoScrollClickInput) {
  return !isInteractiveTarget;
}

export function shouldPauseFromTouchMove({
  startY,
  currentY,
  thresholdPx,
}: TouchPauseInput) {
  if (startY === null) {
    return true;
  }

  return Math.abs(currentY - startY) > thresholdPx;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type MusicPlayerProps = {
  isVisible: boolean;
  src?: string;
};

const invitationOpenEvent = "invitation-open";

export function MusicPlayer({
  isVisible,
  src = "/music/cant-help-falling-in-love.mp3",
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  const play = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.volume = 0.42;
      await audio.play();
      setIsPlaying(true);
      setIsUnavailable(false);
    } catch {
      setIsPlaying(false);
      setIsUnavailable(true);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    function handleInvitationOpen() {
      void play();
    }

    window.addEventListener(invitationOpenEvent, handleInvitationOpen);

    return () => {
      window.removeEventListener(invitationOpenEvent, handleInvitationOpen);
    };
  }, [play]);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      {isVisible ? (
        <button
          type="button"
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          onClick={() => {
            if (isPlaying) {
              pause();
            } else {
              void play();
            }
          }}
          className="fixed bottom-5 right-5 z-50 min-h-12 rounded-full border border-rose-100 bg-white/90 px-5 text-sm font-semibold text-rose-900 shadow-xl shadow-rose-200/60 backdrop-blur transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          {isUnavailable ? "Music unavailable" : isPlaying ? "Pause music" : "Play music"}
        </button>
      ) : null}
    </>
  );
}

export function dispatchInvitationOpenEvent() {
  window.dispatchEvent(new Event(invitationOpenEvent));
}

"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { publicPath } from "@/lib/public-path";
import type { RsvpStatus } from "@/lib/generated/prisma/enums";

type RsvpFormProps = {
  guestSlug?: string;
  initialRsvpStatus?: RsvpStatus;
  initialGuestCount?: number;
  initialMessage?: string | null;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function RsvpForm({
  guestSlug,
  initialRsvpStatus = "PENDING",
  initialGuestCount = 1,
  initialMessage,
}: RsvpFormProps) {
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(initialRsvpStatus);
  const [guestCount, setGuestCount] = useState(initialGuestCount);
  const [message, setMessage] = useState(initialMessage ?? "");
  const [name, setName] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!guestSlug) {
      setState("success");
      return;
    }

    if (rsvpStatus !== "ATTENDING" && rsvpStatus !== "NOT_ATTENDING") {
      setErrorMessage("Vui lòng chọn tham dự hoặc vắng mặt.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/invitations/${guestSlug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rsvpStatus,
          guestCount,
          message: message.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "RSVP could not be submitted");
      }

      setState("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "RSVP could not be submitted");
      setState("error");
    }
  }

  return (
    <div
      id="guestbook"
      className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(251,207,232,0.3),transparent_16rem),radial-gradient(circle_at_48%_64%,rgba(255,255,255,0.82),transparent_20rem)]" />
      <Image
        src={publicPath("/images/florals/side-bouquet-alt.webp")}
        alt=""
        width={280}
        height={640}
        className="pointer-events-none absolute -right-20 -top-28 z-0 hidden w-60 opacity-40 md:block"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-[#9c6a61]">
        <h2 className="font-serif text-2xl font-semibold uppercase tracking-[0.18em] sm:text-3xl">
          Sổ lưu bút
        </h2>

        {state === "success" ? (
          <div className="mx-auto mt-8 rounded-md border border-[#d9b5ad] bg-white/30 p-8">
            <p className="font-serif text-3xl text-[#8e5f57]">Thank you</p>
            <p className="mt-3 leading-7 text-[#9a817b]">
              {guestSlug
                ? "Cảm ơn bạn đã phản hồi. Lời nhắn của bạn đã được ghi nhận."
                : "Your wishes have been saved for this demo invitation."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 grid gap-4 rounded-md border border-[#e3c9c2] bg-white/25 p-5 shadow-lg shadow-rose-100/60 sm:p-6"
          >
            {!guestSlug ? (
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nhập tên của bạn*"
                className="min-h-12 rounded-md border border-[#b7837a] bg-white/30 px-4 text-sm text-[#8e5f57] outline-none placeholder:text-[#c4a09a] focus:ring-4 focus:ring-rose-100"
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus("ATTENDING")}
                    className={`min-h-12 rounded-md border px-4 text-sm font-semibold uppercase tracking-[0.05em] transition ${
                      rsvpStatus === "ATTENDING"
                        ? "border-[#a86f66] bg-[#a86f66] text-white"
                        : "border-[#b7837a] bg-white/30 text-[#8e5f57] hover:bg-white/50"
                    }`}
                  >
                    Sẽ tham dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus("NOT_ATTENDING")}
                    className={`min-h-12 rounded-md border px-4 text-sm font-semibold uppercase tracking-[0.05em] transition ${
                      rsvpStatus === "NOT_ATTENDING"
                        ? "border-[#a86f66] bg-[#a86f66] text-white"
                        : "border-[#b7837a] bg-white/30 text-[#8e5f57] hover:bg-white/50"
                    }`}
                  >
                    Xin phép vắng mặt
                  </button>
                </div>

                {rsvpStatus === "ATTENDING" ? (
                  <label className="flex items-center justify-between gap-4 text-left text-sm text-[#8e5f57]">
                    <span>Số người tham dự</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={guestCount}
                      onChange={(event) => setGuestCount(Number(event.target.value) || 1)}
                      className="min-h-10 w-20 rounded-md border border-[#b7837a] bg-white/30 px-3 text-center outline-none focus:ring-4 focus:ring-rose-100"
                    />
                  </label>
                ) : null}
              </>
            )}

            <textarea
              name="message"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Nhập lời chúc của bạn*"
              className="resize-none rounded-md border border-[#b7837a] bg-white/30 px-4 py-3 text-sm text-[#8e5f57] outline-none placeholder:text-[#c4a09a] focus:ring-4 focus:ring-rose-100"
            />

            {state === "error" && errorMessage ? (
              <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
            ) : null}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={state === "loading"}
                className="min-h-10 rounded-md bg-[#a86f66] px-7 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#8e5f57] focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === "loading" ? "Đang gửi..." : "Gửi lời chúc"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-sm text-[#b08078]">
          Chưa có lời chúc nào. Hãy là người đầu tiên!
        </p>
      </div>
    </div>
  );
}

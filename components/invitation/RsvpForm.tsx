"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

export function RsvpForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      id="guestbook"
      className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(251,207,232,0.3),transparent_16rem),radial-gradient(circle_at_48%_64%,rgba(255,255,255,0.82),transparent_20rem)]" />
      <Image
        src="/images/florals/side-bouquet-alt.webp"
        alt=""
        width={280}
        height={640}
        className="pointer-events-none absolute -right-20 -top-28 z-0 hidden w-60 opacity-40 md:block"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-[#9c6a61]">
        <h2 className="font-serif text-2xl font-semibold uppercase tracking-[0.18em] sm:text-3xl">
          Sổ lưu bút
        </h2>

        {submitted ? (
          <div className="mx-auto mt-8 rounded-md border border-[#d9b5ad] bg-white/30 p-8">
            <p className="font-serif text-3xl text-[#8e5f57]">Thank you</p>
            <p className="mt-3 leading-7 text-[#9a817b]">
              Your wishes have been saved for this demo invitation.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 grid gap-4 rounded-md border border-[#e3c9c2] bg-white/25 p-5 shadow-lg shadow-rose-100/60 sm:p-6"
          >
            <input
              name="name"
              placeholder="Nhập tên của bạn*"
              className="min-h-12 rounded-md border border-[#b7837a] bg-white/30 px-4 text-sm text-[#8e5f57] outline-none placeholder:text-[#c4a09a] focus:ring-4 focus:ring-rose-100"
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Nhập lời chúc của bạn*"
              className="resize-none rounded-md border border-[#b7837a] bg-white/30 px-4 py-3 text-sm text-[#8e5f57] outline-none placeholder:text-[#c4a09a] focus:ring-4 focus:ring-rose-100"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="min-h-10 rounded-md bg-[#a86f66] px-7 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#8e5f57] focus:outline-none focus:ring-4 focus:ring-rose-200"
              >
                Gửi lời chúc
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

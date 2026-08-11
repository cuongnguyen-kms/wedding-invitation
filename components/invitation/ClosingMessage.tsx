"use client";

import { useEffect, useState } from "react";
import { publicPath } from "@/lib/public-path";
import type { WeddingConfig } from "@/lib/wedding-config";

type ClosingMessageProps = {
  couple: WeddingConfig["couple"];
};

export function ClosingMessage({ couple }: ClosingMessageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <section className="px-5 py-20 text-center sm:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-6 py-14 text-[#9c6a61] shadow-2xl shadow-rose-100/70">
        <p className="font-serif text-2xl text-[#b08078] sm:text-3xl">
          Hộp mừng cưới
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-label="Mở hộp mừng cưới để xem mã QR chuyển khoản"
          className="mx-auto mt-8 flex h-40 w-32 rotate-[-3deg] items-center justify-center rounded-md border-4 border-[#f7c23d] bg-red-700 text-4xl text-[#f7c23d] shadow-[0_0_45px_rgba(250,204,21,0.45)] transition hover:rotate-0 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f7c23d]/50"
        >
          囍
        </button>
        <p className="mt-5 text-xs text-[#c4a09a]">Nhấn để mở</p>
        <p className="mx-auto mt-10 max-w-2xl text-base leading-8">
          Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!
        </p>
        <p className="mt-8 font-serif text-3xl text-[#8e5f57]">
          {couple.displayNames}
        </p>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Mã QR mừng cưới"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-6 py-10 text-center text-[#9c6a61] shadow-2xl shadow-rose-950/40 sm:px-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-rose-100/70 text-xl leading-none text-[#8e5f57] transition hover:bg-rose-100"
            >
              &times;
            </button>

            <p className="font-serif text-2xl text-[#b08078] sm:text-3xl">
              Mừng cưới
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#a9827b]">
              Quét mã QR bên dưới để gửi lời chúc mừng đến cô dâu &amp; chú rể
            </p>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-3">
                <p className="font-serif text-lg text-[#8e5f57]">Cô dâu</p>
                <div className="overflow-hidden rounded-2xl border border-rose-100 shadow-lg shadow-rose-100/70">
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimized static JPEG, no benefit from next/image's on-the-fly transform */}
                  <img
                    src={publicPath("/images/qr/bride.jpg")}
                    alt="Mã QR chuyển khoản mừng cưới cô dâu"
                    className="h-auto w-full max-w-[240px]"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <p className="font-serif text-lg text-[#8e5f57]">Chú rể</p>
                <div className="overflow-hidden rounded-2xl border border-rose-100 shadow-lg shadow-rose-100/70">
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimized static JPEG, no benefit from next/image's on-the-fly transform */}
                  <img
                    src={publicPath("/images/qr/groom.jpg")}
                    alt="Mã QR chuyển khoản mừng cưới chú rể"
                    className="h-auto w-full max-w-[240px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

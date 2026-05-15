import type { WeddingConfig } from "@/lib/wedding-config";

type ClosingMessageProps = {
  couple: WeddingConfig["couple"];
};

export function ClosingMessage({ couple }: ClosingMessageProps) {
  return (
    <section className="px-5 py-20 text-center sm:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-6 py-14 text-[#9c6a61] shadow-2xl shadow-rose-100/70">
        <p className="font-serif text-2xl text-[#b08078] sm:text-3xl">
          Hộp mừng cưới
        </p>
        <div className="mx-auto mt-8 flex h-40 w-32 rotate-[-3deg] items-center justify-center rounded-md border-4 border-[#f7c23d] bg-red-700 text-4xl text-[#f7c23d] shadow-[0_0_45px_rgba(250,204,21,0.45)]">
          囍
        </div>
        <p className="mt-5 text-xs text-[#c4a09a]">Nhấn để mở</p>
        <p className="mx-auto mt-10 max-w-2xl text-base leading-8">
          Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!
        </p>
        <p className="mt-8 font-serif text-3xl text-[#8e5f57]">
          {couple.displayNames}
        </p>
      </div>
    </section>
  );
}

import Image from "next/image";
import { publicPath } from "@/lib/public-path";
import type { WeddingConfig } from "@/lib/wedding-config";

type MapSectionProps = {
  location: WeddingConfig["location"];
};

export function MapSection({ location }: MapSectionProps) {
  return (
    <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_62%,rgba(251,207,232,0.3),transparent_16rem),radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.78),transparent_18rem)]" />
      <Image
        src={publicPath("/images/florals/corner-bouquet.webp")}
        alt=""
        width={420}
        height={420}
        className="pointer-events-none absolute -left-28 -top-12 z-0 hidden w-80 opacity-70 md:block"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-[#9c6a61]">
        <h2 className="font-serif text-xl font-semibold uppercase tracking-[0.18em] sm:text-3xl">
          Tiệc Cưới Sẽ Tổ Chức Tại
        </h2>
        <p className="mt-4 font-serif text-2xl text-[#8e5f57]">{location.title}</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#9a817b]">
          {location.address}
        </p>

        <div className="relative mx-auto mt-10 aspect-[1.55/1] max-w-2xl overflow-hidden rounded-md border border-rose-100 bg-rose-50 shadow-lg shadow-rose-100/60">
          <Image
            src={publicPath("/images/map/venue.jpg")}
            alt="Elegant wedding venue with floral decoration"
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#8e5f57]/10" />
        </div>

        <a
          href={location.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex min-h-10 items-center justify-center border-b border-[#a86f66] text-sm font-semibold uppercase tracking-[0.12em] text-[#a86f66] transition hover:text-[#8e5f57] focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          Bản đồ
        </a>
      </div>
    </div>
  );
}

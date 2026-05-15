import Image from "next/image";
import type { GalleryPhoto } from "@/lib/wedding-config";

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
};

const scriptLabels = ["memories", "symphony", "love", "+1"];

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_14%,rgba(251,207,232,0.28),transparent_16rem),radial-gradient(circle_at_28%_78%,rgba(255,255,255,0.82),transparent_18rem)]" />
      <Image
        src="/images/florals/corner-bouquet.webp"
        alt=""
        width={430}
        height={430}
        className="pointer-events-none absolute -left-28 -top-10 z-0 hidden w-80 opacity-70 sm:block"
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="font-serif text-2xl font-semibold uppercase tracking-[0.18em] text-[#9c6a61] sm:text-3xl">
          Album Ảnh Cưới
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {photos.slice(0, 4).map((photo, index) => (
            <figure
              key={photo.src}
              className="group relative aspect-[1.12/1] overflow-hidden rounded-md bg-rose-100 shadow-lg shadow-rose-100/70"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 320px, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div
                className={`absolute inset-0 ${
                  index === 3 ? "bg-stone-950/45" : "bg-gradient-to-t from-stone-950/20 to-transparent"
                }`}
              />
              <figcaption className="absolute bottom-3 left-4 font-serif text-3xl italic text-white drop-shadow sm:text-4xl">
                {scriptLabels[index]}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

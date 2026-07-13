import Image from "next/image";
import { publicPath } from "@/lib/public-path";
import type { GalleryPhoto, WeddingConfig } from "@/lib/wedding-config";

type CoupleHeroProps = {
  couple: WeddingConfig["couple"];
  photos: GalleryPhoto[];
};

export function CoupleHero({ couple, photos }: CoupleHeroProps) {
  const firstPhoto = photos[1] ?? photos[0];
  const secondPhoto = photos[6] ?? photos[0];

  return (
    <div className="relative mx-auto min-h-[760px] overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10 lg:min-h-[860px]">
      <Image
        src={publicPath("/images/florals/corner-bouquet.webp")}
        alt=""
        width={520}
        height={520}
        priority
        className="pointer-events-none absolute -left-24 -top-20 z-0 w-[22rem] max-w-none opacity-95 sm:-left-16 sm:w-[32rem]"
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_35%,rgba(251,207,232,0.34),transparent_18rem),radial-gradient(circle_at_55%_72%,rgba(253,242,248,0.9),transparent_20rem)]" />

      <div className="relative z-10 ml-auto max-w-xl pt-8 text-center lg:pr-12">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#a86f66]">
          Our Wedding
        </p>
        <div className="mt-8 space-y-5 text-[#9c6a61]">
          <div>
            <p className="text-sm uppercase tracking-[0.26em]">Trưởng nam</p>
            <h2 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">
              {couple.groom}
            </h2>
          </div>
          <div className="font-serif text-2xl italic text-[#c79a91]">&</div>
          <div>
            <p className="text-sm uppercase tracking-[0.26em]">Út nữ</p>
            <h2 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">
              {couple.bride}
            </h2>
          </div>
        </div>
        <p className="mx-auto mt-7 max-w-md text-sm uppercase tracking-[0.22em] text-[#b5837a]">
          {couple.dateLabel}
        </p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-stone-600 sm:text-base">
          {couple.intro}
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-12 h-[600px] max-w-lg sm:h-[680px] lg:mt-6">
        <figure className="absolute left-[56%] top-0 z-10 w-52 -translate-x-1/2 rotate-[9deg] rounded-sm border-[8px] border-[#f4c2c7] bg-white p-1 shadow-xl shadow-rose-200/70 sm:w-64">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={publicPath(firstPhoto.src)}
              alt={firstPhoto.alt}
              fill
              sizes="(min-width: 640px) 256px, 208px"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="-mt-7 rotate-[-8deg] font-serif text-4xl italic text-white drop-shadow">
            love
          </figcaption>
        </figure>
        <figure className="absolute left-[44%] top-[220px] z-20 w-56 -translate-x-1/2 rotate-[-9deg] rounded-sm border-[8px] border-[#c8c1d5] bg-white p-1 shadow-2xl shadow-rose-200/80 sm:top-[250px] sm:w-72">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={publicPath(secondPhoto.src)}
              alt={secondPhoto.alt}
              fill
              sizes="(min-width: 640px) 288px, 224px"
              className="object-cover object-center"
            />
          </div>
        </figure>
      </div>

      <Image
        src={publicPath("/images/florals/side-bouquet-alt.webp")}
        alt=""
        width={260}
        height={600}
        className="pointer-events-none absolute -bottom-28 -right-16 z-0 hidden w-52 opacity-50 sm:block"
      />
    </div>
  );
}

import Image from "next/image";
import type { WeddingConfig, WeddingEvent } from "@/lib/wedding-config";

type EventDetailsProps = {
  couple: WeddingConfig["couple"];
  events: WeddingEvent[];
  families: WeddingConfig["families"];
};

function FamilyColumn({
  family,
}: {
  family: WeddingConfig["families"]["groom"];
}) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-[#a86f66]">
        {family.label}
      </p>
      <div className="mt-3 space-y-2 font-serif text-xl font-semibold text-[#9c6a61] sm:text-2xl">
        {family.parents.map((parent) => (
          <p key={parent}>{parent}</p>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-xs text-xs leading-5 text-[#9a817b]">
        {family.address}
      </p>
    </div>
  );
}

export function EventDetails({ couple, events, families }: EventDetailsProps) {
  const ceremony = events[0];

  return (
    <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(251,207,232,0.32),transparent_19rem),radial-gradient(circle_at_52%_58%,rgba(255,255,255,0.78),transparent_18rem)]" />
      <Image
        src="/images/florals/side-bouquet.webp"
        alt=""
        width={320}
        height={760}
        className="pointer-events-none absolute -right-24 top-28 z-0 hidden w-64 opacity-80 md:block"
      />
      <Image
        src="/images/florals/side-bouquet-alt.webp"
        alt=""
        width={260}
        height={620}
        className="pointer-events-none absolute -bottom-32 -left-20 z-0 w-56 opacity-55 sm:w-64"
      />

      <div className="relative z-10">
        <h2 className="font-serif text-2xl font-semibold uppercase tracking-[0.18em] text-[#9c6a61] sm:text-3xl">
          Thông Tin Lễ Cưới
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <FamilyColumn family={families.groom} />
          <FamilyColumn family={families.bride} />
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-[#9c6a61]">
          <p className="text-sm uppercase tracking-[0.2em]">Trân trọng báo tin</p>
          <p className="mt-3 text-sm uppercase tracking-[0.16em]">
            Lễ vu quy của con chúng tôi
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-[#9c6a61]">
          <h3 className="font-serif text-4xl leading-tight sm:text-6xl">
            {couple.groom}
          </h3>
          <p className="my-5 font-serif text-2xl italic text-[#c79a91]">&</p>
          <h3 className="font-serif text-4xl leading-tight sm:text-6xl">
            {couple.bride}
          </h3>
        </div>

        <div className="mx-auto mt-10 max-w-xl text-[#9c6a61]">
          <p className="text-sm uppercase tracking-[0.18em]">
            Lễ vu quy sẽ được cử hành tại
          </p>
          <p className="mt-3 font-serif text-2xl text-[#8e5f57]">
            {ceremony.venue}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#9a817b]">{ceremony.address}</p>
        </div>

        <div className="mx-auto mt-10 max-w-md text-[#9c6a61]">
          <p className="font-serif text-3xl">{ceremony.time}</p>
          <div className="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 text-sm uppercase tracking-[0.14em]">
            <span>{ceremony.weekday}</span>
            <span className="h-8 w-px bg-rose-200" />
            <span className="font-serif text-4xl tracking-normal text-[#8e5f57]">
              {ceremony.day}
            </span>
            <span className="h-8 w-px bg-rose-200" />
            <span>Tháng {ceremony.month}</span>
          </div>
          <p className="mt-7 font-serif text-2xl">{ceremony.year}</p>
        </div>
      </div>
    </div>
  );
}

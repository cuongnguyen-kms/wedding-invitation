import type { WeddingScheduleItem } from "@/lib/wedding-config";

type LoveStoryTimelineProps = {
  items: WeddingScheduleItem[];
};

export function LoveStoryTimeline({ items }: LoveStoryTimelineProps) {
  return (
    <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_66%,rgba(251,207,232,0.3),transparent_17rem),radial-gradient(circle_at_52%_52%,rgba(255,255,255,0.75),transparent_19rem)]" />
      <div className="relative z-10 mx-auto max-w-xl text-[#9c6a61]">
        <h2 className="font-serif text-xl font-semibold uppercase tracking-[0.18em] sm:text-3xl">
          Lịch Trình Ngày Cưới
        </h2>

        <div className="relative mx-auto mt-10 max-w-lg">
          <div className="absolute bottom-6 left-[calc(6rem+1.35rem)] top-6 w-px bg-[#d9b5ad] sm:left-[calc(7rem+1.6rem)]" />
          <div className="space-y-8">
            {items.map((item) => (
              <div
                key={`${item.time}-${item.activity}`}
                className="relative grid grid-cols-[6rem_auto_1fr] items-center gap-x-5 text-left sm:grid-cols-[7rem_auto_1fr] sm:gap-x-8"
              >
                <p className="text-right font-serif text-lg text-[#a86f66]">
                  {item.time}
                </p>
                <span className="relative z-10 h-3 w-3 rounded-full bg-[#a86f66] shadow-[0_0_0_5px_rgba(255,250,247,0.95)]" />
                <p className="text-base text-[#9c6a61]">{item.activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

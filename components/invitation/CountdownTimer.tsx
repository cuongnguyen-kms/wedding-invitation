import Image from "next/image";
import { publicPath } from "@/lib/public-path";
import type { WeddingEvent } from "@/lib/wedding-config";

type CountdownTimerProps = {
  event: WeddingEvent;
};

export function CountdownTimer({ event }: CountdownTimerProps) {
  const month = Number(event.month);
  const year = Number(event.year);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Monday = 0
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(251,207,232,0.26),transparent_18rem),radial-gradient(circle_at_74%_62%,rgba(255,255,255,0.8),transparent_16rem)]" />
      <Image
        src={publicPath("/images/florals/side-bouquet.webp")}
        alt=""
        width={320}
        height={760}
        className="pointer-events-none absolute -right-24 top-8 z-0 hidden w-64 opacity-70 md:block"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-[#9c6a61]">
        <h2 className="font-serif text-xl font-semibold uppercase tracking-[0.18em] sm:text-3xl">
          Thông Tin Tiệc Cưới
        </h2>
        <p className="mt-8 text-lg uppercase tracking-[0.12em] sm:text-2xl">
          Tiệc cưới sẽ diễn ra vào lúc:
        </p>
        <p className="mt-6 font-serif text-3xl text-[#8e5f57]">{event.time}</p>

        <div className="mx-auto mt-8 max-w-md text-[#9c6a61]">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 text-xs uppercase tracking-[0.14em] sm:text-sm">
            <span>{event.weekday}</span>
            <span className="h-8 w-px bg-rose-200" />
            <span className="font-serif text-4xl tracking-normal text-[#8e5f57]">
              {event.day}
            </span>
            <span className="h-8 w-px bg-rose-200" />
            <span>Tháng {event.month}</span>
          </div>
          <p className="mt-6 font-serif text-2xl">{event.year}</p>
        </div>

        <div className="mx-auto mt-10 max-w-sm rounded-md border border-[#d9b5ad] bg-white/30 px-4 py-4">
          <p className="font-serif text-sm font-semibold">Tháng {event.month} / {event.year}</p>
          <div className="mt-4 grid grid-cols-7 gap-2 text-xs">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <span key={`${day}-${index}`} className="font-semibold text-[#b08078]">
                {day}
              </span>
            ))}
            {calendarCells.map((day, index) =>
              day === null ? (
                <span key={`blank-${index}`} />
              ) : (
                <span
                  key={day}
                  className={`flex aspect-square items-center justify-center rounded-full ${
                    day === Number(event.day)
                      ? "bg-[#a86f66] text-white"
                      : "text-[#9c6a61]"
                  }`}
                >
                  {day}
                </span>
              ),
            )}
          </div>
        </div>

        <a
          href="#guestbook"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-md bg-[#a86f66] px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-rose-200/60 transition hover:bg-[#8e5f57] focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          Xác nhận tham dự
        </a>
      </div>
    </div>
  );
}

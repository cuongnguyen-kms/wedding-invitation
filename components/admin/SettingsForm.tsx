"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { TimelineItem, WeddingEvent, WeddingFamily, WeddingScheduleItem } from "@/lib/wedding-config";

type SettingsFormInitial = {
  groomName: string;
  brideName: string;
  displayNames: string;
  weddingDateTime: string;
  weddingDateLabel: string;
  intro: string;
  locationTitle: string;
  locationAddress: string;
  locationMapUrl: string;
  events: WeddingEvent[];
  schedule: WeddingScheduleItem[];
  story: TimelineItem[];
  families: { groom: WeddingFamily; bride: WeddingFamily };
};

type SettingsFormProps = {
  initial: SettingsFormInitial;
};

const inputClassName =
  "min-h-10 rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200";
const labelClassName = "grid gap-1 text-sm font-medium text-stone-700";
const sectionClassName = "mt-8 rounded-md border border-stone-200 bg-white p-5";
const removeButtonClassName =
  "min-h-8 rounded-md border border-red-200 px-3 text-xs font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300";
const addButtonClassName =
  "min-h-9 rounded-md border border-stone-300 px-3 text-xs font-medium text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-300";

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

const emptyEvent: WeddingEvent = {
  title: "",
  date: "",
  weekday: "",
  day: "",
  month: "",
  year: "",
  time: "",
  venue: "",
  address: "",
};

const emptySchedule: WeddingScheduleItem = { time: "", activity: "" };
const emptyStory: TimelineItem = { date: "", title: "", description: "" };

function updateAt<T>(list: T[], index: number, value: T): T[] {
  return list.map((item, i) => (i === index ? value : item));
}

function removeAt<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();

  const [groomName, setGroomName] = useState(initial.groomName);
  const [brideName, setBrideName] = useState(initial.brideName);
  const [displayNames, setDisplayNames] = useState(initial.displayNames);
  const [weddingDateTime, setWeddingDateTime] = useState(toDatetimeLocalValue(initial.weddingDateTime));
  const [weddingDateLabel, setWeddingDateLabel] = useState(initial.weddingDateLabel);
  const [intro, setIntro] = useState(initial.intro);
  const [locationTitle, setLocationTitle] = useState(initial.locationTitle);
  const [locationAddress, setLocationAddress] = useState(initial.locationAddress);
  const [locationMapUrl, setLocationMapUrl] = useState(initial.locationMapUrl);
  const [events, setEvents] = useState<WeddingEvent[]>(initial.events);
  const [schedule, setSchedule] = useState<WeddingScheduleItem[]>(initial.schedule);
  const [story, setStory] = useState<TimelineItem[]>(initial.story);
  const [groomFamily, setGroomFamily] = useState(initial.families.groom);
  const [groomParentsText, setGroomParentsText] = useState(initial.families.groom.parents.join(", "));
  const [brideFamily, setBrideFamily] = useState(initial.families.bride);
  const [brideParentsText, setBrideParentsText] = useState(initial.families.bride.parents.join(", "));

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    setSaved(false);

    const payload = {
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      displayNames: displayNames.trim(),
      weddingDateTime,
      weddingDateLabel: weddingDateLabel.trim(),
      intro: intro.trim(),
      locationTitle: locationTitle.trim(),
      locationAddress: locationAddress.trim(),
      locationMapUrl: locationMapUrl.trim(),
      events,
      schedule,
      story,
      families: {
        groom: {
          ...groomFamily,
          parents: groomParentsText.split(",").map((name) => name.trim()).filter(Boolean),
        },
        bride: {
          ...brideFamily,
          parents: brideParentsText.split(",").map((name) => name.trim()).filter(Boolean),
        },
      },
    };

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrors(data?.issues ?? [data?.error ?? "Settings could not be saved"]);
        setSubmitting(false);
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setErrors(["Network error — please try again"]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-3xl">
      {errors.length > 0 ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-disc pl-4">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {saved ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Settings saved.
        </div>
      ) : null}

      <div className={sectionClassName}>
        <h2 className="text-sm font-semibold text-stone-700">Couple &amp; wedding date</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClassName}>
            Groom name
            <input value={groomName} onChange={(e) => setGroomName(e.target.value)} className={inputClassName} />
          </label>
          <label className={labelClassName}>
            Bride name
            <input value={brideName} onChange={(e) => setBrideName(e.target.value)} className={inputClassName} />
          </label>
          <label className={labelClassName}>
            Display names
            <input
              value={displayNames}
              onChange={(e) => setDisplayNames(e.target.value)}
              className={inputClassName}
              placeholder="e.g. Quốc Cường & Bảo Quyên"
            />
          </label>
          <label className={labelClassName}>
            Wedding date label
            <input
              value={weddingDateLabel}
              onChange={(e) => setWeddingDateLabel(e.target.value)}
              className={inputClassName}
              placeholder="e.g. October 10, 2026"
            />
          </label>
          <label className={labelClassName}>
            Wedding date &amp; time
            <input
              type="datetime-local"
              value={weddingDateTime}
              onChange={(e) => setWeddingDateTime(e.target.value)}
              className={inputClassName}
            />
          </label>
        </div>
        <label className={`${labelClassName} mt-4`}>
          Intro
          <textarea
            rows={3}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className="resize-none rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </label>
      </div>

      <div className={sectionClassName}>
        <h2 className="text-sm font-semibold text-stone-700">Location</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClassName}>
            Venue title
            <input
              value={locationTitle}
              onChange={(e) => setLocationTitle(e.target.value)}
              className={inputClassName}
            />
          </label>
          <label className={labelClassName}>
            Map URL
            <input
              value={locationMapUrl}
              onChange={(e) => setLocationMapUrl(e.target.value)}
              className={inputClassName}
            />
          </label>
        </div>
        <label className={`${labelClassName} mt-4`}>
          Address
          <input
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            className={inputClassName}
          />
        </label>
      </div>

      <div className={sectionClassName}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">Events</h2>
          <button
            type="button"
            onClick={() => setEvents([...events, { ...emptyEvent }])}
            className={addButtonClassName}
          >
            Add event
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {events.map((eventItem, index) => (
            <div key={index} className="rounded-md border border-stone-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-stone-500">Event {index + 1}</p>
                <button
                  type="button"
                  onClick={() => setEvents(removeAt(events, index))}
                  className={removeButtonClassName}
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className={labelClassName}>
                  Title
                  <input
                    value={eventItem.title}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, title: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Date label
                  <input
                    value={eventItem.date}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, date: e.target.value }))}
                    className={inputClassName}
                    placeholder="e.g. Sunday, October 11, 2026"
                  />
                </label>
                <label className={labelClassName}>
                  Weekday
                  <input
                    value={eventItem.weekday}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, weekday: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Day
                  <input
                    value={eventItem.day}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, day: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Month
                  <input
                    value={eventItem.month}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, month: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Year
                  <input
                    value={eventItem.year}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, year: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Time
                  <input
                    value={eventItem.time}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, time: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Venue
                  <input
                    value={eventItem.venue}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, venue: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Address
                  <input
                    value={eventItem.address}
                    onChange={(e) => setEvents(updateAt(events, index, { ...eventItem, address: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
              </div>
            </div>
          ))}
          {events.length === 0 ? <p className="text-sm text-stone-400">No events yet.</p> : null}
        </div>
      </div>

      <div className={sectionClassName}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">Reception schedule</h2>
          <button
            type="button"
            onClick={() => setSchedule([...schedule, { ...emptySchedule }])}
            className={addButtonClassName}
          >
            Add item
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {schedule.map((item, index) => (
            <div key={index} className="flex flex-wrap items-end gap-3">
              <label className={labelClassName}>
                Time
                <input
                  value={item.time}
                  onChange={(e) => setSchedule(updateAt(schedule, index, { ...item, time: e.target.value }))}
                  className={`${inputClassName} w-28`}
                />
              </label>
              <label className={`${labelClassName} flex-1`}>
                Activity
                <input
                  value={item.activity}
                  onChange={(e) => setSchedule(updateAt(schedule, index, { ...item, activity: e.target.value }))}
                  className={`${inputClassName} w-full`}
                />
              </label>
              <button
                type="button"
                onClick={() => setSchedule(removeAt(schedule, index))}
                className={removeButtonClassName}
              >
                Remove
              </button>
            </div>
          ))}
          {schedule.length === 0 ? <p className="text-sm text-stone-400">No schedule items yet.</p> : null}
        </div>
      </div>

      <div className={sectionClassName}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">Love story timeline</h2>
          <button
            type="button"
            onClick={() => setStory([...story, { ...emptyStory }])}
            className={addButtonClassName}
          >
            Add moment
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {story.map((item, index) => (
            <div key={index} className="rounded-md border border-stone-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-stone-500">Moment {index + 1}</p>
                <button
                  type="button"
                  onClick={() => setStory(removeAt(story, index))}
                  className={removeButtonClassName}
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className={labelClassName}>
                  Date
                  <input
                    value={item.date}
                    onChange={(e) => setStory(updateAt(story, index, { ...item, date: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Title
                  <input
                    value={item.title}
                    onChange={(e) => setStory(updateAt(story, index, { ...item, title: e.target.value }))}
                    className={inputClassName}
                  />
                </label>
              </div>
              <label className={`${labelClassName} mt-3`}>
                Description
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => setStory(updateAt(story, index, { ...item, description: e.target.value }))}
                  className="resize-none rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
            </div>
          ))}
          {story.length === 0 ? <p className="text-sm text-stone-400">No timeline moments yet.</p> : null}
        </div>
      </div>

      <div className={sectionClassName}>
        <h2 className="text-sm font-semibold text-stone-700">Families</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="grid gap-3">
            <p className="text-xs font-semibold uppercase text-stone-500">Groom&apos;s family</p>
            <label className={labelClassName}>
              Label
              <input
                value={groomFamily.label}
                onChange={(e) => setGroomFamily({ ...groomFamily, label: e.target.value })}
                className={inputClassName}
                placeholder="e.g. Ông bà"
              />
            </label>
            <label className={labelClassName}>
              Parent names (comma-separated)
              <input
                value={groomParentsText}
                onChange={(e) => setGroomParentsText(e.target.value)}
                className={inputClassName}
              />
            </label>
            <label className={labelClassName}>
              Address
              <input
                value={groomFamily.address}
                onChange={(e) => setGroomFamily({ ...groomFamily, address: e.target.value })}
                className={inputClassName}
              />
            </label>
          </div>
          <div className="grid gap-3">
            <p className="text-xs font-semibold uppercase text-stone-500">Bride&apos;s family</p>
            <label className={labelClassName}>
              Label
              <input
                value={brideFamily.label}
                onChange={(e) => setBrideFamily({ ...brideFamily, label: e.target.value })}
                className={inputClassName}
                placeholder="e.g. Ông bà"
              />
            </label>
            <label className={labelClassName}>
              Parent names (comma-separated)
              <input
                value={brideParentsText}
                onChange={(e) => setBrideParentsText(e.target.value)}
                className={inputClassName}
              />
            </label>
            <label className={labelClassName}>
              Address
              <input
                value={brideFamily.address}
                onChange={(e) => setBrideFamily({ ...brideFamily, address: e.target.value })}
                className={inputClassName}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="min-h-10 rounded-md bg-rose-700 px-5 text-sm font-medium text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}

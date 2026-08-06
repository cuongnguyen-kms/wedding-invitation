import { prisma } from "@/lib/db";
import type { WeddingFamily, WeddingScheduleItem, TimelineItem, WeddingEvent } from "@/lib/wedding-config";
import { weddingConfig } from "@/lib/wedding-config";
import { weddingSettingsSchema, type WeddingSettingsInput } from "@/schemas/settings";

const SETTINGS_ID = "singleton";

export type WeddingContent = {
  couple: {
    groom: string;
    bride: string;
    displayNames: string;
    date: string;
    dateLabel: string;
    intro: string;
  };
  events: WeddingEvent[];
  schedule: WeddingScheduleItem[];
  story: TimelineItem[];
  families: { groom: WeddingFamily; bride: WeddingFamily };
  location: { title: string; address: string; mapUrl: string };
};

function defaultsInput(): WeddingSettingsInput {
  return {
    groomName: weddingConfig.couple.groom,
    brideName: weddingConfig.couple.bride,
    displayNames: weddingConfig.couple.displayNames,
    weddingDateTime: new Date(weddingConfig.couple.date),
    weddingDateLabel: weddingConfig.couple.dateLabel,
    intro: weddingConfig.couple.intro,
    locationTitle: weddingConfig.location.title,
    locationAddress: weddingConfig.location.address,
    locationMapUrl: weddingConfig.location.mapUrl,
    events: weddingConfig.events,
    schedule: weddingConfig.schedule,
    story: weddingConfig.story,
    families: weddingConfig.families,
  };
}

function inputToContent(input: WeddingSettingsInput): WeddingContent {
  return {
    couple: {
      groom: input.groomName,
      bride: input.brideName,
      displayNames: input.displayNames,
      date: input.weddingDateTime.toISOString(),
      dateLabel: input.weddingDateLabel,
      intro: input.intro,
    },
    events: input.events,
    schedule: input.schedule,
    story: input.story,
    families: input.families,
    location: {
      title: input.locationTitle,
      address: input.locationAddress,
      mapUrl: input.locationMapUrl,
    },
  };
}

function serialize(data: WeddingSettingsInput) {
  return {
    groomName: data.groomName,
    brideName: data.brideName,
    displayNames: data.displayNames,
    weddingDateTime: data.weddingDateTime,
    weddingDateLabel: data.weddingDateLabel,
    intro: data.intro,
    locationTitle: data.locationTitle,
    locationAddress: data.locationAddress,
    locationMapUrl: data.locationMapUrl,
    eventsJson: JSON.stringify(data.events),
    scheduleJson: JSON.stringify(data.schedule),
    storyJson: JSON.stringify(data.story),
    familiesJson: JSON.stringify(data.families),
  };
}

function deserialize(row: {
  groomName: string;
  brideName: string;
  displayNames: string;
  weddingDateTime: Date;
  weddingDateLabel: string;
  intro: string;
  locationTitle: string;
  locationAddress: string;
  locationMapUrl: string;
  eventsJson: string;
  scheduleJson: string;
  storyJson: string;
  familiesJson: string;
}): WeddingSettingsInput {
  return {
    groomName: row.groomName,
    brideName: row.brideName,
    displayNames: row.displayNames,
    weddingDateTime: row.weddingDateTime,
    weddingDateLabel: row.weddingDateLabel,
    intro: row.intro,
    locationTitle: row.locationTitle,
    locationAddress: row.locationAddress,
    locationMapUrl: row.locationMapUrl,
    events: JSON.parse(row.eventsJson),
    schedule: JSON.parse(row.scheduleJson),
    story: JSON.parse(row.storyJson),
    families: JSON.parse(row.familiesJson),
  };
}

// Returns the admin-editable input shape, falling back to the static
// weddingConfig defaults if the settings row hasn't been seeded yet.
export async function getSettingsInput(): Promise<WeddingSettingsInput> {
  const row = await prisma.weddingSettings.findUnique({ where: { id: SETTINGS_ID } });
  return row ? deserialize(row) : defaultsInput();
}

// Returns the shape consumed by the public invitation pages.
export async function getWeddingContent(): Promise<WeddingContent> {
  const input = await getSettingsInput();
  return inputToContent(input);
}

export async function updateSettings(input: unknown): Promise<WeddingContent> {
  const data = weddingSettingsSchema.parse(input);
  const row = await prisma.weddingSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...serialize(data) },
    update: serialize(data),
  });
  return inputToContent(deserialize(row));
}

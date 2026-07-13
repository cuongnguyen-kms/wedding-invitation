import { describe, expect, it } from "vitest";
import { createGuestSchema, updateGuestSchema } from "./guest";

describe("createGuestSchema", () => {
  it("accepts a minimal valid guest and defaults guestCount to 1", () => {
    const result = createGuestSchema.parse({ name: "Nguyen Van Nam" });
    expect(result.guestCount).toBe(1);
  });

  it("rejects a missing name", () => {
    expect(() => createGuestSchema.parse({})).toThrow();
  });

  it("rejects an empty name", () => {
    expect(() => createGuestSchema.parse({ name: "" })).toThrow();
  });

  it("rejects guestCount below 1", () => {
    expect(() =>
      createGuestSchema.parse({ name: "Nam", guestCount: 0 }),
    ).toThrow();
  });

  it("rejects an invalid email", () => {
    expect(() =>
      createGuestSchema.parse({ name: "Nam", email: "not-an-email" }),
    ).toThrow();
  });

  it("rejects an rsvpStatus outside the enum", () => {
    expect(() =>
      createGuestSchema.parse({ name: "Nam", rsvpStatus: "MAYBE" }),
    ).toThrow();
  });

  it("accepts full guest details", () => {
    const result = createGuestSchema.parse({
      name: "Nguyen Van Nam",
      phone: "0900000000",
      email: "nam@example.com",
      group: "friend",
      invitationTitle: "Anh",
      guestCount: 2,
    });
    expect(result).toMatchObject({
      name: "Nguyen Van Nam",
      phone: "0900000000",
      email: "nam@example.com",
      group: "friend",
      invitationTitle: "Anh",
      guestCount: 2,
    });
  });
});

describe("updateGuestSchema", () => {
  it("allows a partial update without forcing guestCount to default", () => {
    const result = updateGuestSchema.parse({ phone: "0911111111" });
    expect(result).toEqual({ phone: "0911111111" });
    expect(result.guestCount).toBeUndefined();
  });

  it("still rejects an empty name when name is provided", () => {
    expect(() => updateGuestSchema.parse({ name: "" })).toThrow();
  });

  it("still rejects guestCount below 1 when provided", () => {
    expect(() => updateGuestSchema.parse({ guestCount: 0 })).toThrow();
  });
});

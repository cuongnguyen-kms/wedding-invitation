import { describe, expect, it } from "vitest";
import { rsvpSubmissionSchema } from "./rsvp";

describe("rsvpSubmissionSchema", () => {
  it("accepts a valid attending RSVP", () => {
    const result = rsvpSubmissionSchema.parse({
      rsvpStatus: "ATTENDING",
      guestCount: 2,
      message: "Chuc hai ban hanh phuc",
    });
    expect(result.rsvpStatus).toBe("ATTENDING");
  });

  it("rejects an rsvpStatus outside PENDING/ATTENDING/NOT_ATTENDING", () => {
    expect(() =>
      rsvpSubmissionSchema.parse({ rsvpStatus: "MAYBE", guestCount: 1 }),
    ).toThrow();
  });

  it("rejects guestCount below 1", () => {
    expect(() =>
      rsvpSubmissionSchema.parse({ rsvpStatus: "ATTENDING", guestCount: 0 }),
    ).toThrow();
  });

  it("rejects a message longer than 500 characters", () => {
    expect(() =>
      rsvpSubmissionSchema.parse({
        rsvpStatus: "ATTENDING",
        guestCount: 1,
        message: "a".repeat(501),
      }),
    ).toThrow();
  });

  it("rejects private guest fields smuggled into the public RSVP payload", () => {
    expect(() =>
      rsvpSubmissionSchema.parse({
        rsvpStatus: "ATTENDING",
        guestCount: 1,
        phone: "0900000000",
        slug: "someone-else",
      }),
    ).toThrow();
  });
});

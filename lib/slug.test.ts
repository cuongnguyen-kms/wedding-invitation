import { describe, expect, it } from "vitest";
import { generateUniqueSlug, slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates plain ascii names", () => {
    expect(slugify("John Smith")).toBe("john-smith");
  });

  it("strips Vietnamese diacritics, including đ", () => {
    expect(slugify("Nguyễn Văn Nam")).toBe("nguyen-van-nam");
    expect(slugify("Đặng Thị Bích Ngọc")).toBe("dang-thi-bich-ngoc");
  });

  it("collapses punctuation and repeated whitespace into single hyphens", () => {
    expect(slugify("  Multiple   Spaces & Punctuation!! ")).toBe(
      "multiple-spaces-punctuation",
    );
  });
});

describe("generateUniqueSlug", () => {
  it("returns the plain slug when it is not taken", async () => {
    const slug = await generateUniqueSlug("Nguyễn Văn Nam", async () => false);
    expect(slug).toBe("nguyen-van-nam");
  });

  it("appends a numeric suffix for duplicate guest names until it finds a free slug", async () => {
    const taken = new Set(["nguyen-van-nam", "nguyen-van-nam-2"]);
    const slug = await generateUniqueSlug("Nguyễn Văn Nam", async (candidate) =>
      taken.has(candidate),
    );
    expect(slug).toBe("nguyen-van-nam-3");
  });

  it("falls back to a generic base when the name has no sluggable characters", async () => {
    const slug = await generateUniqueSlug("!!!", async () => false);
    expect(slug).toBe("guest");
  });
});

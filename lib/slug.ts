const DIACRITIC_RANGE_START = String.fromCharCode(0x0300);
const DIACRITIC_RANGE_END = String.fromCharCode(0x036f);
const COMBINING_DIACRITICS_PATTERN = new RegExp(`[${DIACRITIC_RANGE_START}-${DIACRITIC_RANGE_END}]`, "g");

export function slugify(input: string): string {
  const withoutDiacritics = input
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS_PATTERN, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  return withoutDiacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  name: string,
  isSlugTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(name) || "guest";
  let candidate = base;
  let suffix = 2;

  while (await isSlugTaken(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

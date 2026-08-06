import { describe, expect, it } from "vitest";
import { parseCsv, toCsv } from "./csv";

describe("toCsv", () => {
  it("joins plain cells with commas and rows with CRLF", () => {
    expect(toCsv([["a", "b"], ["c", "d"]])).toBe("a,b\r\nc,d");
  });

  it("quotes cells containing commas, quotes, or newlines", () => {
    expect(toCsv([["hello, world", 'say "hi"', "line1\nline2"]])).toBe(
      '"hello, world","say ""hi""","line1\nline2"',
    );
  });
});

describe("parseCsv", () => {
  it("parses plain rows", () => {
    expect(parseCsv("a,b\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("round-trips values produced by toCsv", () => {
    const rows = [["Nguyễn Văn Nam", "hello, world", 'say "hi"', "line1\nline2"]];
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });

  it("handles trailing newline and blank lines without producing empty rows", () => {
    expect(parseCsv("a,b\nc,d\n")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("handles CRLF line endings", () => {
    expect(parseCsv("a,b\r\nc,d\r\n")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });
});

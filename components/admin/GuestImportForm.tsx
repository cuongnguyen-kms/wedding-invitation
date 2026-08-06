"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ImportResult = {
  created: number;
  errors: { row: number; message: string }[];
};

export function GuestImportForm() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const text = await file.text();
      const response = await fetch("/api/guests/import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Import failed");
      }

      setResult(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setSubmitting(false);
      event.target.value = "";
    }
  }

  return (
    <div className="mt-6 max-w-xl">
      <p className="text-sm text-stone-600">
        Upload a CSV with a <code>name</code> column and any of: <code>slug</code>,{" "}
        <code>phone</code>, <code>email</code>, <code>group</code>, <code>invitationTitle</code>,{" "}
        <code>guestCount</code>, <code>rsvpStatus</code>, <code>message</code>. A file exported
        from &ldquo;Export CSV&rdquo; matches this format.
      </p>

      <label className="mt-4 grid gap-1 text-sm font-medium text-stone-700">
        <span>CSV file</span>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={submitting}
          className="min-h-10 rounded-md border border-stone-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-rose-700 file:px-3 file:py-1.5 file:text-white focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </label>

      {submitting ? (
        <p className="mt-4 text-sm text-stone-500">Importing {fileName}...</p>
      ) : null}

      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

      {result ? (
        <div className="mt-4 rounded-md border border-stone-200 bg-white p-4 text-sm">
          <p className="font-medium text-stone-800">
            {result.created} guest{result.created === 1 ? "" : "s"} imported.
          </p>
          {result.errors.length > 0 ? (
            <>
              <p className="mt-2 font-medium text-red-700">
                {result.errors.length} row{result.errors.length === 1 ? "" : "s"} skipped:
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-red-700">
                {result.errors.map((issue) => (
                  <li key={issue.row}>
                    Row {issue.row}: {issue.message}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

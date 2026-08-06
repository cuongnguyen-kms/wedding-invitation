"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PhotoSummary } from "@/lib/photos";

type PhotoManagerProps = {
  photos: PhotoSummary[];
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function PhotoManager({ photos }: PhotoManagerProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadErrors([]);
    const errors: string[] = [];

    for (const [index, file] of files.entries()) {
      setUploadStatus(`Uploading ${index + 1} of ${files.length}: ${file.name}`);

      try {
        const imageData = await fileToBase64(file);
        const response = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData, alt: file.name.replace(/\.[^.]+$/, "") }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          errors.push(`${file.name}: ${data?.error ?? "upload failed"}`);
        }
      } catch {
        errors.push(`${file.name}: upload failed`);
      }
    }

    setUploading(false);
    setUploadStatus(null);
    setUploadErrors(errors);
    event.target.value = "";
    router.refresh();
  }

  return (
    <div className="mt-6">
      <div className="rounded-md border border-stone-200 bg-white p-5">
        <label className="grid gap-1 text-sm font-medium text-stone-700">
          <span>Upload photos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={handleFilesSelected}
            className="min-h-10 rounded-md border border-stone-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-rose-700 file:px-3 file:py-1.5 file:text-white focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </label>
        {uploadStatus ? <p className="mt-2 text-sm text-stone-500">{uploadStatus}</p> : null}
        {uploadErrors.length > 0 ? (
          <ul className="mt-2 list-disc pl-4 text-sm text-red-700">
            {uploadErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-stone-500">
        {photos.length} photo{photos.length === 1 ? "" : "s"}
      </p>

      {photos.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
          No photos uploaded yet. The public gallery falls back to the developer-managed images
          in lib/wedding-config.ts until you add some here.
        </p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <PhotoRow
              key={photo.id}
              photo={photo}
              isFirst={index === 0}
              isLast={index === photos.length - 1}
              onChanged={() => router.refresh()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type PhotoRowProps = {
  photo: PhotoSummary;
  isFirst: boolean;
  isLast: boolean;
  onChanged: () => void;
};

function PhotoRow({ photo, isFirst, isLast, onChanged }: PhotoRowProps) {
  const [alt, setAlt] = useState(photo.alt);
  const [busy, setBusy] = useState(false);

  async function saveAlt() {
    if (alt === photo.alt) return;
    setBusy(true);
    await fetch(`/api/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt }),
    });
    setBusy(false);
    onChanged();
  }

  async function move(direction: "up" | "down") {
    setBusy(true);
    await fetch(`/api/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ move: direction }),
    });
    setBusy(false);
    onChanged();
  }

  async function handleDelete() {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
    setBusy(false);
    onChanged();
  }

  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- server-generated JPEG from our own API route, not an optimizable static asset */}
      <img
        src={`/api/photos/${photo.id}/thumb`}
        alt={photo.alt || "Gallery photo"}
        className="aspect-[4/3] w-full rounded-md object-cover"
      />
      <input
        value={alt}
        onChange={(event) => setAlt(event.target.value)}
        onBlur={saveAlt}
        placeholder="Alt text"
        disabled={busy}
        className="mt-2 min-h-9 w-full rounded-md border border-stone-300 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => move("up")}
            disabled={busy || isFirst}
            className="min-h-8 rounded-md border border-stone-300 px-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move("down")}
            disabled={busy || isLast}
            className="min-h-8 rounded-md border border-stone-300 px-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↓
          </button>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="min-h-8 rounded-md border border-red-200 px-2 text-xs font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteGuestButtonProps = {
  guestId: string;
  guestName: string;
};

export function DeleteGuestButton({ guestId, guestName }: DeleteGuestButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete ${guestName}? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/guests/${guestId}`, { method: "DELETE" });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Guest could not be deleted");
      }

      router.push("/admin/guests");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Guest could not be deleted");
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="min-h-10 rounded-md border border-red-300 px-4 text-sm font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete guest"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

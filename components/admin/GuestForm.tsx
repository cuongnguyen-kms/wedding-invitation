"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest } from "@/lib/generated/prisma/client";
import type { RsvpStatus } from "@/lib/generated/prisma/enums";

type GuestFormProps = { mode: "create"; guest?: undefined } | { mode: "edit"; guest: Guest };

const RSVP_STATUS_OPTIONS: { value: RsvpStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "ATTENDING", label: "Attending" },
  { value: "NOT_ATTENDING", label: "Not attending" },
];

const fieldClassName =
  "min-h-10 rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200";
const labelClassName = "grid gap-1 text-sm font-medium text-stone-700";

export function GuestForm({ mode, guest }: GuestFormProps) {
  const router = useRouter();
  const [name, setName] = useState(guest?.name ?? "");
  const [slug, setSlug] = useState(guest?.slug ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [email, setEmail] = useState(guest?.email ?? "");
  const [group, setGroup] = useState(guest?.group ?? "");
  const [invitationTitle, setInvitationTitle] = useState(guest?.invitationTitle ?? "");
  const [guestCount, setGuestCount] = useState(guest?.guestCount ?? 1);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(guest?.rsvpStatus ?? "PENDING");
  const [message, setMessage] = useState(guest?.message ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      group: group.trim() || undefined,
      invitationTitle: invitationTitle.trim() || undefined,
      guestCount,
      rsvpStatus,
      message: message.trim() || undefined,
    };

    const url = mode === "create" ? "/api/guests" : `/api/guests/${guest.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrors(data?.issues ?? [data?.error ?? "Something went wrong. Please try again."]);
        setSubmitting(false);
        return;
      }

      router.push("/admin/guests");
      router.refresh();
    } catch {
      setErrors(["Network error — please try again."]);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid max-w-xl gap-4">
      {errors.length > 0 ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-disc pl-4">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <label className={labelClassName}>
        Name*
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={fieldClassName}
        />
      </label>

      <label className={labelClassName}>
        Slug
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="Auto-generated from name if left blank"
          className={fieldClassName}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClassName}>
          Phone
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClassName} />
        </label>
        <label className={labelClassName}>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClassName}>
          Group
          <input value={group} onChange={(event) => setGroup(event.target.value)} className={fieldClassName} />
        </label>
        <label className={labelClassName}>
          Invitation title
          <input
            value={invitationTitle}
            onChange={(event) => setInvitationTitle(event.target.value)}
            placeholder="e.g. Anh, Chị"
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClassName}>
          Guest count
          <input
            type="number"
            min={1}
            value={guestCount}
            onChange={(event) => setGuestCount(Number(event.target.value) || 1)}
            className={fieldClassName}
          />
        </label>
        <label className={labelClassName}>
          RSVP status
          <select
            value={rsvpStatus}
            onChange={(event) => setRsvpStatus(event.target.value as RsvpStatus)}
            className={fieldClassName}
          >
            {RSVP_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={labelClassName}>
        Message
        <textarea
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="resize-none rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </label>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="min-h-10 rounded-md bg-rose-700 px-5 text-sm font-medium text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : mode === "create" ? "Add guest" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

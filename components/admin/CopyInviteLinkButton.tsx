"use client";

import { useState } from "react";

type CopyInviteLinkButtonProps = {
  slug: string;
};

export function CopyInviteLinkButton({ slug }: CopyInviteLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/invite/${slug}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy invitation link", url);
      return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

import Link from "next/link";
import { GuestImportForm } from "@/components/admin/GuestImportForm";

export default function ImportGuestsPage() {
  return (
    <div>
      <Link href="/admin/guests" className="text-sm text-stone-500 hover:underline">
        ← Back to guests
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Import guests</h1>
      <GuestImportForm />
    </div>
  );
}

import Link from "next/link";
import { GuestForm } from "@/components/admin/GuestForm";

export default function NewGuestPage() {
  return (
    <div>
      <Link href="/admin/guests" className="text-sm text-stone-500 hover:underline">
        ← Back to guests
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Add guest</h1>
      <GuestForm mode="create" />
    </div>
  );
}

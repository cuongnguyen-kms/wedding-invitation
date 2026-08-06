import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteGuestButton } from "@/components/admin/DeleteGuestButton";
import { GuestForm } from "@/components/admin/GuestForm";
import { getGuestById } from "@/lib/guests";

type EditGuestPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditGuestPage({ params }: EditGuestPageProps) {
  const { id } = await params;
  const guest = await getGuestById(id);

  if (!guest) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/guests" className="text-sm text-stone-500 hover:underline">
        ← Back to guests
      </Link>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Edit guest</h1>
        <DeleteGuestButton guestId={guest.id} guestName={guest.name} />
      </div>
      <GuestForm mode="edit" guest={guest} />

      <div className="mt-8 max-w-xl rounded-md border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-700">Invitation QR code</h2>
        {/* eslint-disable-next-line @next/next/no-img-element -- server-generated PNG from our own API route, not an optimizable static asset */}
        <img
          src={`/api/guests/${guest.id}/qrcode`}
          alt={`QR code linking to ${guest.name}'s invitation`}
          width={160}
          height={160}
          className="mt-3 rounded-md border border-stone-200"
        />
        <a
          href={`/api/guests/${guest.id}/qrcode`}
          download={`${guest.slug}-qrcode.png`}
          className="mt-3 inline-block rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Download PNG
        </a>
      </div>
    </div>
  );
}

import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettingsInput } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettingsInput();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Wedding settings</h1>
      <p className="mt-2 text-sm text-stone-500">
        Edits here update the couple, date, events, schedule, love story, and family details shown
        on the public invitation. Photos and music stay developer-managed.
      </p>
      <SettingsForm
        initial={{
          ...settings,
          weddingDateTime: settings.weddingDateTime.toISOString(),
        }}
      />
    </div>
  );
}

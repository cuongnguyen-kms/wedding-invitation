import { InvitationPage } from "@/components/invitation/InvitationPage";
import { weddingConfig } from "@/lib/wedding-config";

export default function Home() {
  return <InvitationPage config={weddingConfig} />;
}

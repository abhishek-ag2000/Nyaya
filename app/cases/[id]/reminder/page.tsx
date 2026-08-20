import ComingSoon from "@/components/ComingSoon";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";

export default async function CreateReminderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseId = decodeURIComponent(id);
  return <><Disclaimer /><Header /><ComingSoon title="Create a reminder" description="Hearing and deadline reminders will be designed here. This site does not send SMS, email, or calendar invitations." backHref={`/cases/${caseId}`} /><Footer /></>;
}

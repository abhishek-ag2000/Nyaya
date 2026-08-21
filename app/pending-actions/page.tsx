import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import PendingActions from "@/components/workspaces/PendingActions";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "Pending Actions",
  "Role-aware pending actions across cases in your signed-in Nyaya workspace.",
  "/pending-actions"
);

export default function PendingActionsPage() {
  return (
    <>
      <Disclaimer />
      <Header />
      <PendingActions />
      <Footer />
    </>
  );
}

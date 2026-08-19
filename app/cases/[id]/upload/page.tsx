import { redirect } from "next/navigation";

export default function LegacyUploadRoute({ params }: { params: { id: string } }) {
  redirect(`/cases/${params.id}/documents/upload`);
}

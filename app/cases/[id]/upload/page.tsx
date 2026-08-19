import { redirect } from "next/navigation";

export default async function LegacyUploadRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/cases/${id}/documents/upload`);
}

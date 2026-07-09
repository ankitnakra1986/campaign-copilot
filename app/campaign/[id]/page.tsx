import { DraftWorkspace } from "@/components/draft-workspace";

export default async function CampaignDraftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DraftWorkspace id={id} />;
}

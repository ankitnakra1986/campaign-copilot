import { CampaignResults } from "@/components/campaign-results";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignResults id={id} />;
}

import { SendConfirmation } from "@/components/send-confirmation";

export default async function SentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SendConfirmation id={id} />;
}

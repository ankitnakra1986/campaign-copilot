import { Suspense } from "react";
import { SlackInbox } from "@/components/slack-inbox";

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-white" />}>
      <SlackInbox />
    </Suspense>
  );
}

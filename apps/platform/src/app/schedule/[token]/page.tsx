import type { Metadata } from "next";

import ScheduleClient from "./schedule-client";

export const metadata: Metadata = {
  title: "Schedule Interview | Amaxa",
  description: "Select your preferred interview time slot",
};

interface SchedulePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const { token } = await params;

  return <ScheduleClient token={token} />;
}

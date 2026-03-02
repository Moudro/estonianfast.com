import { notFound } from "next/navigation";
import { DayPageClient } from "@/components/day-page-client";

type DayPageProps = {
  params: Promise<{
    dayNumber: string;
  }>;
};

export default async function DayPage({ params }: DayPageProps) {
  const { dayNumber: rawDayNumber } = await params;
  const dayNumber = Number(rawDayNumber);

  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
    notFound();
  }

  return <DayPageClient dayNumber={dayNumber} />;
}

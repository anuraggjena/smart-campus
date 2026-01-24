import { computePCI } from "./pci";

export function aggregateDomainPCI(
  interactions: {
    intent: string;
    aiConfidence: number | null;
    followUp: boolean;
  }[]
) {
  const total = interactions.length;

  const followUps = interactions.filter(i => i.followUp).length;

  const lowConfidence = interactions.filter(
    i => (i.aiConfidence ?? 100) < 60
  ).length;

  return computePCI({
    totalInteractions: total,
    followUpCount: followUps,
    lowConfidenceCount: lowConfidence,
  });
}

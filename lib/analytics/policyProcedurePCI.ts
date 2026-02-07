import { computePCI } from "./pci";

type Interaction = {
  policyCode: string | null;
  procedureCode: string | null;
  aiConfidence: number | null;
  followUp: boolean;
};

export function aggregateByItem(interactions: Interaction[]) {
  const map: Record<string, Interaction[]> = {};

  interactions.forEach((i) => {
    const key = i.policyCode ?? i.procedureCode;
    if (!key) return;

    if (!map[key]) map[key] = [];
    map[key].push(i);
  });

  return Object.entries(map).map(([code, items]) => {
    const total = items.length;
    const followUps = items.filter(i => i.followUp).length;
    const lowConfidence = items.filter(
      i => (i.aiConfidence ?? 100) < 60
    ).length;

    const pci = computePCI({
      totalInteractions: total,
      followUpCount: followUps,
      lowConfidenceCount: lowConfidence,
    });

    return {
      code,
      total,
      followUps,
      lowConfidence,
      pci,
    };
  }).sort((a, b) => a.pci - b.pci); // worst first
}

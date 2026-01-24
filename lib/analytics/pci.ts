type PCIInput = {
  totalInteractions: number;
  followUpCount: number;
  lowConfidenceCount: number;
};

export function computePCI({
  totalInteractions,
  followUpCount,
  lowConfidenceCount,
}: PCIInput): number {
  if (totalInteractions === 0) return 100;

  const followUpPenalty =
    (followUpCount / totalInteractions) * 40;

  const lowConfidencePenalty =
    (lowConfidenceCount / totalInteractions) * 30;

  const rawScore =
    100 - followUpPenalty - lowConfidencePenalty;

  return Math.max(0, Math.round(rawScore));
}

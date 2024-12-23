export function calculateExpectedOutcome(ratingA: number, ratingB: number) {
  const expectedOutcomeA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedOutcomeB = 1 - expectedOutcomeA; // Complement of A's probability
  return { expectedOutcomeA, expectedOutcomeB };
}

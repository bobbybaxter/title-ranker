export function calculateK({
  ratingAmt,
  minRatings,
  maxRatings,
}: {
  ratingAmt: number;
  minRatings: number;
  maxRatings: number;
}) {
  // Handle the edge case where all ratings are the same
  if (minRatings === maxRatings) {
    return 30; // Default to the midpoint of the K range
  }

  // Define the range for K values
  const minK = 10;
  const maxK = 50;

  // Normalize the number of ratings to a value between 0 and 1
  const normalizedRating = (ratingAmt - minRatings) / (maxRatings - minRatings);

  // Calculate the dynamic K value
  const K = maxK - normalizedRating * (maxK - minK);

  return K;
}

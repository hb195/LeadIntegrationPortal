// Mirrors server/src/constants/budget.js BUDGET_BUCKETS.
// Duplicated intentionally (no shared package between client/server for this project).
export const BUDGET_BUCKETS = {
  UNDER_10K: { label: 'Under $10k', min: 0, max: 10000 },
  BETWEEN_10K_50K: { label: '$10k-$50k', min: 10000, max: 50000 },
  OVER_50K: { label: 'Greater than $50k', min: 50000, max: 100000 },
};

export const BUDGET_OPTIONS = Object.entries(BUDGET_BUCKETS).map(([value, bucket]) => ({
  value,
  label: bucket.label,
}));

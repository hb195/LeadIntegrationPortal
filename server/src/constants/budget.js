// Budget buckets as offered in the public lead form dropdown.
// min/max are representative dollar bounds used later to estimate pipeline value,
// since the form only captures a bucket, not an exact figure.
const BUDGET_BUCKETS = {
  UNDER_10K: { label: 'Under $10k', min: 0, max: 10000 },
  BETWEEN_10K_50K: { label: '$10k-$50k', min: 10000, max: 50000 },
  OVER_50K: { label: 'Greater than $50k', min: 50000, max: 100000 },
};

// Possible lead statuses. Only 'New' is used today; kept as an array so
// additional statuses (e.g. Contacted, Qualified) can be appended later
// without changing how consumers reference the default.
const STATUS_VALUES = ['New'];

const DEFAULT_STATUS = STATUS_VALUES[0];

module.exports = {
  BUDGET_BUCKETS,
  STATUS_VALUES,
  DEFAULT_STATUS,
};

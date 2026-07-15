import { BUDGET_BUCKETS } from '../../constants/budget';

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`;
}

function AnalyticsBadges({ leads }) {
  const totalLeads = leads.length;

  const pipeline = leads.reduce(
    (acc, lead) => {
      const bucket = BUDGET_BUCKETS[lead.budget];
      if (!bucket) return acc;
      return { min: acc.min + bucket.min, max: acc.max + bucket.max };
    },
    { min: 0, max: 0 },
  );

  return (
    <div className="analytics-badges">
      <div className="analytics-badge">
        <span className="analytics-badge-label">Total Leads</span>
        <span className="analytics-badge-value">{totalLeads}</span>
      </div>
      <div className="analytics-badge">
        <span className="analytics-badge-label">Estimated Pipeline Value</span>
        <span className="analytics-badge-value">
          {totalLeads === 0 ? '$0' : `${formatCurrency(pipeline.min)} - ${formatCurrency(pipeline.max)}`}
        </span>
      </div>
    </div>
  );
}

export default AnalyticsBadges;

import { BUDGET_BUCKETS } from '../../constants/budget';

function LeadTable({ leads }) {
  if (leads.length === 0) {
    return <p className="lead-table-empty">No leads yet.</p>;
  }

  return (
    <table className="lead-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Budget</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.firstName} {lead.lastName}</td>
            <td>{lead.email}</td>
            <td>{lead.company}</td>
            <td>{BUDGET_BUCKETS[lead.budget]?.label ?? lead.budget}</td>
            <td>{lead.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeadTable;

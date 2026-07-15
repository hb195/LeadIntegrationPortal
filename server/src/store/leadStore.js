/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} company
 * @property {string} budget - one of BUDGET_BUCKETS keys (see constants/budget.js)
 * @property {string} status - one of STATUS_VALUES (see constants/budget.js)
 * @property {string} createdAt - ISO timestamp
 */

// In-memory store only. This array lives in process memory and is not
// persisted anywhere, so all leads are lost whenever the server restarts.
// See README.md "Data Persistence" section.
let leads = [];

/**
 * @param {Lead} lead
 * @returns {Lead}
 */
function addLead(lead) {
  leads.push(lead);
  return lead;
}

/**
 * @returns {Lead[]}
 */
function getAllLeads() {
  return leads.slice();
}

/**
 * Case-insensitive lookup used to detect duplicate submissions.
 * @param {string} email
 * @returns {Lead|null}
 */
function findByEmail(email) {
  const normalized = email.toLowerCase();
  return leads.find((lead) => lead.email.toLowerCase() === normalized) || null;
}

module.exports = {
  addLead,
  getAllLeads,
  findByEmail,
};

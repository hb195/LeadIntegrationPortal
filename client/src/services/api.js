const API_BASE_URL = 'http://localhost:8080/api';

export async function postLead(payload) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

export async function getLeads() {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/leads`);
  } catch {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

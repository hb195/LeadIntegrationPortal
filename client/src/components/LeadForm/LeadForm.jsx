import { useState } from 'react';
import { postLead } from '../../services/api';
import { BUDGET_OPTIONS } from '../../constants/budget';
import './LeadForm.css';

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  budget: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mirrors the backend's rejection of markup characters in free-text fields.
const UNSAFE_CHARS_REGEX = /[<>]/;

function validate(formData) {
  const errors = {};

  if (!formData.firstName.trim()) errors.firstName = 'First name is required';
  else if (UNSAFE_CHARS_REGEX.test(formData.firstName)) errors.firstName = 'First name contains invalid characters';

  if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
  else if (UNSAFE_CHARS_REGEX.test(formData.lastName)) errors.lastName = 'Last name contains invalid characters';

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!formData.company.trim()) errors.company = 'Company name is required';
  else if (UNSAFE_CHARS_REGEX.test(formData.company)) errors.company = 'Company name contains invalid characters';

  if (!formData.budget) errors.budget = 'Please select a budget range';

  return errors;
}

function LeadForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setStatus('idle');
      return;
    }

    setFieldErrors({});
    setSubmitError(null);
    setStatus('submitting');

    try {
      await postLead(formData);
      setFormData(INITIAL_FORM_DATA);
      setStatus('success');
    } catch (err) {
      setSubmitError(err.message);
      setStatus('error');
    }
  }

  const isSubmitting = status === 'submitting';

  return (
    <div className="lead-form-container">
      <h1>Lead Distribution Portal</h1>

      {status === 'success' && (
        <div className="lead-form-banner success">
          Thanks! Your submission has been received.
        </div>
      )}

      {status === 'error' && submitError && (
        <div className="lead-form-banner error">{submitError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="lead-form-field">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
          {fieldErrors.firstName && (
            <span className="lead-form-error">{fieldErrors.firstName}</span>
          )}
        </div>

        <div className="lead-form-field">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
          {fieldErrors.lastName && (
            <span className="lead-form-error">{fieldErrors.lastName}</span>
          )}
        </div>

        <div className="lead-form-field">
          <label htmlFor="email">Corporate Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {fieldErrors.email && (
            <span className="lead-form-error">{fieldErrors.email}</span>
          )}
        </div>

        <div className="lead-form-field">
          <label htmlFor="company">Company Name</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
          />
          {fieldErrors.company && (
            <span className="lead-form-error">{fieldErrors.company}</span>
          )}
        </div>

        <div className="lead-form-field">
          <label htmlFor="budget">Estimated Annual Budget</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          >
            <option value="">Select a budget range</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.budget && (
            <span className="lead-form-error">{fieldErrors.budget}</span>
          )}
        </div>

        <button type="submit" className="lead-form-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default LeadForm;

const { ApiError } = require("./errorHandler");
const { BUDGET_BUCKETS } = require("../constants/budget");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Free-text fields are rendered verbatim in the dashboard table. React escapes
// text children by default, so this isn't the XSS boundary — but rejecting
// markup characters up front keeps stored data clean and blocks it at the edge too.
const UNSAFE_CHARS_REGEX = /[<>]/;

function validateCreateLead(req, res, next) {
  const { firstName, lastName, email, company, budget } = req.body || {};
  const errors = [];

  if (!firstName || !firstName.trim()) errors.push("firstName is required");
  else if (UNSAFE_CHARS_REGEX.test(firstName)) errors.push("firstName contains invalid characters");

  if (!lastName || !lastName.trim()) errors.push("lastName is required");
  else if (UNSAFE_CHARS_REGEX.test(lastName)) errors.push("lastName contains invalid characters");

  if (!email || !EMAIL_REGEX.test(email.trim()))
    errors.push("email must be a valid email address");

  if (!company || !company.trim()) errors.push("company is required");
  else if (UNSAFE_CHARS_REGEX.test(company)) errors.push("company contains invalid characters");
  if (
    !budget ||
    !Object.prototype.hasOwnProperty.call(BUDGET_BUCKETS, budget)
  ) {
    errors.push(
      `budget must be one of: ${Object.keys(BUDGET_BUCKETS).join(", ")}`,
    );
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join("; ")));
  }

  next();
}

module.exports = { validateCreateLead };

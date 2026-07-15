// Thrown deliberately by validation/route code; carries the HTTP status
// that should be sent back to the client alongside its message.
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Centralized error handler. Must be registered last, after all routes.
// Anything without a `.status` is treated as unexpected, so its real
// message/stack is logged server-side but never sent to the client.
function errorHandler(err, req, res, next) {
  if (!err.status) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.status(err.status).json({ error: err.message });
}

module.exports = { ApiError, errorHandler };

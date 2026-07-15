const express = require("express");
const { randomUUID } = require("crypto");
const { validateCreateLead } = require("../middleware/validateLead");
const { ApiError } = require("../middleware/errorHandler");
const { addLead, getAllLeads, findByEmail } = require("../store/leadStore");
const { DEFAULT_STATUS } = require("../constants/budget");
const { broadcast } = require("../ws/socketServer");

const router = express.Router();

router.post("/", validateCreateLead, (req, res, next) => {
  const { firstName, lastName, email, company, budget } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  if (findByEmail(normalizedEmail)) {
    return next(
      new ApiError(409, "A lead with this email has already been submitted."),
    );
  }

  const lead = addLead({
    id: randomUUID(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    company: company.trim(),
    budget,
    status: DEFAULT_STATUS,
    createdAt: new Date().toISOString(),
  });

  broadcast("lead_created", lead);

  res.status(201).json(lead);
});

router.get("/", (req, res) => {
  res.status(200).json(getAllLeads());
});

module.exports = router;

const express = require("express");
const cors = require("cors");
const leadsRouter = require("./routes/leads.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadsRouter);

app.use(errorHandler);

module.exports = app;

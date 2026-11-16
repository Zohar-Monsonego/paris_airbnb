// The Express app (without listen - server.js starts it, and the tests use this file directly)
const express = require("express");
const hostRouter = require("./routes/hosts.routes.js");
const listingsRouter = require("./routes/listings.routes.js");

const app = express();
app.use(express.json());

app.use("/api/listings", listingsRouter);
app.use("/api/hosts", hostRouter);

// Any other /api path -> 404 as JSON
app.use("/api", (req, res) => {
  res
    .status(404)
    .json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

module.exports = app;

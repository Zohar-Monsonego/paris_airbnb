// Router for /api/hosts - only paths -> controller functions (no logic, no SQL).
//
// Step 4: GET /:hostId/listings -> all the places of one host

const express = require("express");
const router = express.Router();

const { getHostListings } = require("../controllers/hosts.controller.js");

router.get("/:hostId/listings", getHostListings);

module.exports = router;

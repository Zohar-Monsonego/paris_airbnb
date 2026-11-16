// Router for /api/listings - only paths -> controller functions (no logic, no SQL).
//
// Step 2: GET /      -> the cards (filters, sort, limit)
// Step 3: GET /:id   -> one place with host details
//

const express = require("express");
const router = express.Router();
const {
  getListing,
  getListingById,
} = require("../controllers/listings.controller.js");

router.get("/", getListing);
router.get("/:id", getListingById);
module.exports = router;

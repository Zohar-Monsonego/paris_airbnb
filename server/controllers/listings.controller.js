// Controller for /api/listings - reads req.query / req.params, validates, calls the DAL,
// sets the status code and sends JSON. No SQL here.
//
// Step 2: getListings(req, res)
//   - read neighbourhood, roomType, minPrice, maxPrice, sort, limit from req.query
//   - validate: limit (default 20, max 50), minPrice/maxPrice are numbers, sort is "price" or "rating"
//     (anything else -> 400 { error })
//   - map sort to a column name here: ORDER BY can't be a parameter
//

const { getListings: getListingsFromDAL } = require("../dal/listings.dal.js");
const {
  getListingById: getListingByIdFromDAL,
} = require("../dal/listings.dal.js");

async function getListing(req, res) {
  const { neighbourhood, roomType, minPrice, maxPrice, sort, limit } =
    req.query;

  //validating the limit number
  let limit_num;
  if (limit !== undefined) {
    limit_num = Number(limit);

    if (limit_num <= 0 || !Number.isInteger(limit_num)) {
      return res.status(400).json({ error: "Invalid limit input" });
    } else {
      limit_num = Math.min(limit_num, 50);
    }
  } else {
    limit_num = 20;
  }

  //validating the minPrice, if it is a number
  let min_price_num;

  //checks if the value of minPrice has been sent because it is optional
  if (minPrice !== undefined) {
    min_price_num = Number(minPrice);
    if (
      minPrice.trim() === "" ||
      !Number.isFinite(min_price_num) ||
      min_price_num < 0
    ) {
      return res.status(400).json({ error: "Invalid min price" });
    }
  }

  //validating the maxPrice, if it is a number
  let max_price_num;

  //checks if the value of maxPrice has been sent because it is optional
  if (maxPrice !== undefined) {
    max_price_num = Number(maxPrice);
    if (
      maxPrice.trim() === "" ||
      !Number.isFinite(max_price_num) ||
      max_price_num < 0
    ) {
      return res.status(400).json({ error: "Invalid max price" });
    }
  }

  //validation of the sort parameter, checking if the parameter has been sent if it is, checking if its value is rating or price
  if (sort !== undefined) {
    if (sort !== "rating" && sort !== "price") {
      return res.status(400).json({ error: "Invalid sort kind" });
    }
  }

  //creating an object that contains all the sort options so we would be able to send the db the sort para not in string
  const orderBy = {
    price: "price",
    rating: "review_scores_rating",
  };

  try {
    const all_listing = await getListingsFromDAL({
      neighbourhood,
      roomType,
      minPrice: min_price_num,
      maxPrice: max_price_num,
      orderBy: orderBy[sort ?? "price"],
      limit: limit_num,
    });

    return res.json(all_listing);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
// Step 3: getListingById(req, res)

async function getListingById(req, res) {
  const id = Number(req.params.id); //converting the id sent to a number

  //checking if even after the conversion, id is a number and an integer number
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id is not a number" });
  }

  try {
    //getting from db the list
    const result = await getListingByIdFromDAL(id);

    //if there is no such id exists in the db
    if (!result) {
      return res.status(404).json({ error: "no such ID" });
    }

    //we converting the value in the field 'hostIsSuperhost' from string to boolean value
    if (result.hostIsSuperhost === "t") {
      result.hostIsSuperhost = true;
    } else {
      result.hostIsSuperhost = false;
    }

    //returning the list
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "error while trying to fetch from db list by ID" });
  }
}

module.exports = { getListing, getListingById };

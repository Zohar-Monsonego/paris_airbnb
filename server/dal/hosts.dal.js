// DAL for hosts
//
// Step 4: getListingsByHost(hostId)
//   WHERE host_id = @hostId AND price IS NOT NULL, ORDER BY price ASC
//   UPPER(host_name) AS hostName + the same card fields as Step 2

const { sql, poolPromise } = require("../config/db.js");

async function getListingsByHost(host_id) {
  const pool = await poolPromise;
  const request = pool.request();

  //getting the host id that was excepted
  request.input("hostId", sql.Int, host_id);

  try {
    const result = await request.query(`
    SELECT CAST(id AS INT) AS id,
    CONCAT(room_type, ' in ', neighbourhood_cleansed) AS title,
    UPPER(property_type) AS propertyType,
    room_type AS roomType,
    neighbourhood_cleansed AS neighbourhood,
    CAST(price AS INT) AS pricePerNight,
    ROUND(review_scores_rating / 20.0, 1) AS stars,
    CAST(number_of_reviews AS INT) AS reviewsCount,
    CAST(bedrooms AS INT) AS bedrooms,
    CAST(beds AS INT) AS beds,
    CAST(accommodates AS INT) AS accommodates,
    UPPER(host_name) AS hostName
    FROM dbo.Paris_Airbnb_listings
    WHERE price IS NOT NULL AND host_id = @hostId
    ORDER BY price ASC;`);

    return result.recordset;
  } catch (e) {
    console.log(e, "error while trying to fetch listings by host id from db");
    throw e;
  }
}

module.exports = { getListingsByHost };

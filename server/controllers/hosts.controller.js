// Controller for /api/hosts
//
// Step 4: getHostListings(req, res)
//   - hostId is not a number -> 400, no places found -> 404
//   - try/catch -> 500 { error }

const {
  getListingsByHost: getListingsByHostFromDAL,
} = require("../dal/hosts.dal.js");

async function getHostListings(req, res) {
  const host_id = Number(req.params.hostId);

  if (!Number.isInteger(host_id)) {
    return res.status(400).json({ error: "host id is not a number" });
  }

  try {
    const result = await getListingsByHostFromDAL(host_id);

    //if there is no place with this host id we check if the array returned is empty
    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "no place found with this host ID" });
    }

    return res.json(result);
  } catch (e) {
    return res
      .status(500)
      .json({ error: "error while trying to fetch listing by host id" });
  }
}

module.exports = { getHostListings };

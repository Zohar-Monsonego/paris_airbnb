// Starts the server: node server.js (or npm start / npm run dev)
require("dotenv").config({
  path: require("node:path").join(__dirname, ".env"),
  quiet: true,
});
const { poolPromise } = require("./config/db.js");

const app = require("./app");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await poolPromise;
    console.log("Connected to SQL Server");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(`Database connection failed: ${e}`);
  }
}

startServer();

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

(async () => {
  try {
    await connectDB(MONGODB_URI);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
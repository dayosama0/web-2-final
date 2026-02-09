const express = require("express");
const cors = require("cors");
const path = require("path");

const casesRoutes = require("./routes/cases.routes");
const evidenceRoutes = require("./routes/evidence.routes");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// static
app.use(express.static(path.join(__dirname, "..", "public")));

// default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "auth.html"));
});

// test API
app.get("/api", (req, res) => {
  res.json({ ok: true, service: "GEvidence Mongo API" });
});

// routes
app.use("/auth", authRoutes);
app.use("/cases", casesRoutes);
app.use("/evidence", evidenceRoutes);

app.use(errorHandler);

module.exports = app;
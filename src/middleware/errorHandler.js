function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "ValidationError",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = errorHandler;
const mongoose = require("mongoose");

function validateObjectId(paramName = "id") {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ error: `Invalid ObjectId in parameter '${paramName}'.` });
    }
    next();
  };
}

module.exports = validateObjectId;
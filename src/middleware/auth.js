const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header. Use: Bearer <token>" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload: { sub, role, email, iat, exp }
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = auth;
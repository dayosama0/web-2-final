const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");

const ADMIN_REGISTER_KEY = process.env.ADMIN_REGISTER_KEY || "qwerty";

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /auth/register
async function register(req, res, next) {
  try {
    const { email, password, role, adminKey } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 chars." });
    }

    // admin only with keyword
    if (role === "admin") {
      if (!adminKey || adminKey !== ADMIN_REGISTER_KEY) {
        return res.status(403).json({ error: "Invalid admin key." });
      }
    }

    const safeRole = role === "admin" ? "admin" : "user";

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: safeRole,
    });

    const token = signToken(user);

    return res.status(201).json({
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    return next(err);
  }
}

// POST /auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password." });

    const token = signToken(user);

    return res.json({
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    return next(err);
  }
}

// GET /auth/me (optional)
async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).select("_id email role createdAt updatedAt");
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me };
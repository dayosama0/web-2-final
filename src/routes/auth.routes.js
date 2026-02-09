const express = require("express");
const { body, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const controller = require("../controllers/auth.controller");

const router = express.Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }
  next();
}

const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("role").optional().isIn(["user", "admin"]),
  body("adminKey")
    .optional()
    .isString()
    .custom((value, { req }) => {
      if (req.body.role === "admin" && (!value || value.trim().length === 0)) {
        throw new Error("adminKey is required for admin role");
      }
      return true;
    }),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
];

router.post("/register", registerValidation, handleValidation, controller.register);
router.post("/login", loginValidation, handleValidation, controller.login);
router.get("/me", auth, controller.me); // optional

module.exports = router;
const express = require("express");
const { body, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const validateObjectId = require("../middleware/validateObjectId");
const controller = require("../controllers/cases.controller");

const router = express.Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }
  next();
}

const caseValidation = [
  body("title").isString().trim().notEmpty(),
  body("orgId").isString().trim().notEmpty(),
  body("site.country").isString().trim().notEmpty(),
  body("site.city").isString().trim().notEmpty(),
  body("metric.key").isString().trim().notEmpty(),
  body("metric.unit").isString().trim().notEmpty(),
  body("period.from").isISO8601(),
  body("period.to").isISO8601(),
  body("methodology.standard").isString().trim().notEmpty(),
  body("methodology.approach").isString().trim().notEmpty(),
  body("status").optional().isIn(["draft", "in_review", "verified", "rejected"]),
];

const caseUpdateValidation = [
  body("title").optional().isString().trim().notEmpty(),
  body("orgId").optional().isString().trim().notEmpty(),
  body("site.country").optional().isString().trim().notEmpty(),
  body("site.city").optional().isString().trim().notEmpty(),
  body("metric.key").optional().isString().trim().notEmpty(),
  body("metric.unit").optional().isString().trim().notEmpty(),
  body("period.from").optional().isISO8601(),
  body("period.to").optional().isISO8601(),
  body("methodology.standard").optional().isString().trim().notEmpty(),
  body("methodology.approach").optional().isString().trim().notEmpty(),
  body("status").optional().isIn(["draft", "in_review", "verified", "rejected"]),
];

const caseStatusValidation = [
  body("status").isIn(["draft", "in_review", "verified", "rejected"]),
];

// public
router.get("/", controller.getAllCases);
router.get("/:id", validateObjectId("id"), controller.getCaseById);

// admin-only
router.post("/", auth, requireRole("admin"), caseValidation, handleValidation, controller.createCase);

router.put(
  "/:id",
  auth,
  requireRole("admin"),
  validateObjectId("id"),
  caseUpdateValidation,
  handleValidation,
  controller.updateCase
);

router.delete(
  "/:id",
  auth,
  requireRole("admin"),
  validateObjectId("id"),
  controller.deleteCase
);

router.patch(
  "/:id/status",
  auth,
  requireRole("admin"),
  validateObjectId("id"),
  caseStatusValidation,
  handleValidation,
  controller.updateCaseStatus
);

module.exports = router;
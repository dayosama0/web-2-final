const express = require("express");
const { body, validationResult } = require("express-validator");

const validateObjectId = require("../middleware/validateObjectId");
const controller = require("../controllers/evidence.controller");

const router = express.Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }
  next();
}

const evidenceValidation = [
  body("caseId").isString().notEmpty(),
  body("name").isString().trim().notEmpty(),
  body("type").isIn(["telemetry_csv", "summary_pdf", "invoice_pdf", "sensor_snapshot", "blockchain_anchor", "other"]),
  body("sha256").isString().trim().notEmpty(),
  body("source.uploadedBy").isString().trim().notEmpty(),
  body("source.storageUrl").optional().isString(),
  body("source.gatewayId").optional().isString(),
  body("source.sensorId").optional().isString(),
];

router.get("/", controller.getAllEvidence);
router.get("/:id", validateObjectId("id"), controller.getEvidenceById);

// Relationship route: list evidence for a specific case
router.get("/case/:caseId", validateObjectId("caseId"), controller.getEvidenceByCaseId);

router.post("/", evidenceValidation, handleValidation, controller.createEvidence);
router.put("/:id", (req, res) => {
  res.status(405).json({
    error: "Method Not Allowed",
    message: "Evidence artifacts are immutable in this MVP. Use POST to create and DELETE to remove.",
  });
});

router.delete("/:id", validateObjectId("id"), controller.deleteEvidence);

module.exports = router;
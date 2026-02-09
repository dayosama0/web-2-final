const mongoose = require("mongoose");

const EvidenceArtifactSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VerificationCase",
      required: true,
    },

    name: { type: String, required: true, trim: true },

    type: {
      type: String,
      enum: ["telemetry_csv", "summary_pdf", "invoice_pdf", "sensor_snapshot", "blockchain_anchor", "other"],
      required: true,
    },

    sha256: { type: String, required: true, trim: true },

    source: {
      uploadedBy: { type: String, required: true, trim: true },
      storageUrl: { type: String, trim: true },
      gatewayId: { type: String, trim: true },
      sensorId: { type: String, trim: true },
    },

    anchoring: {
      chain: { type: String, trim: true },
      txHash: { type: String, trim: true },
      anchoredAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EvidenceArtifact", EvidenceArtifactSchema);
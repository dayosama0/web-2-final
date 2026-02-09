const mongoose = require("mongoose");

const VerificationCaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    orgId: { type: String, required: true, trim: true },

    site: {
      country: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    metric: {
      key: { type: String, required: true, trim: true },
      unit: { type: String, required: true, trim: true },
    },

    period: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },

    methodology: {
      standard: { type: String, required: true, trim: true },
      approach: { type: String, required: true, trim: true },
    },

    status: {
      type: String,
      enum: ["draft", "in_review", "verified", "rejected"],
      default: "draft",
      required: true,
    },

    result: {
      verifiedValue: { type: Number },
      confidenceScore: { type: Number, min: 0, max: 1 },
      issues: [{ type: String }],
    },

    nftCertificate: {
      tokenId: { type: Number },
      contractAddress: { type: String, trim: true },
      network: { type: String, trim: true },
      txHash: { type: String, trim: true },
      issuedAt: { type: Date },
      issuer: { type: String, trim: true },
      status: { type: String, enum: ["verified", "rejected"] },
      metadataUri: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VerificationCase", VerificationCaseSchema);
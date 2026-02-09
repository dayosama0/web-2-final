const crypto = require("crypto");
const VerificationCase = require("../models/VerificationCase");

async function getAllCases(req, res) {
  const cases = await VerificationCase.find().sort({ createdAt: -1 });
  res.json(cases);
}

async function getCaseById(req, res) {
  const item = await VerificationCase.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "VerificationCase not found." });
  res.json(item);
}

async function createCase(req, res) {
  const created = await VerificationCase.create(req.body);
  res.status(201).json(created);
}

async function updateCase(req, res) {
  const updated = await VerificationCase.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: "VerificationCase not found." });
  res.json(updated);
}

async function deleteCase(req, res) {
  const deleted = await VerificationCase.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "VerificationCase not found." });
  res.json({ success: true });
}

function mintMockNftCertificate({ caseId, orgId, status }) {
  return {
    tokenId: crypto.randomInt(1, 1_000_000_000),
    contractAddress: "0xMOCK_CONTRACT_ADDRESS",
    network: "sepolia",
    txHash: "0x" + crypto.randomBytes(32).toString("hex"),
    issuedAt: new Date(),
    issuer: "GEvidence",
    status, // verified | rejected
    metadataUri: `https://gevidence.local/metadata/${caseId}.json`,
  };
}

// PATCH /cases/:id/status
async function updateCaseStatus(req, res) {
  const { status } = req.body || {};

  const item = await VerificationCase.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "VerificationCase not found." });

  item.status = status;

  if ((status === "verified" || status === "rejected") && !item.nftCertificate) {
    item.nftCertificate = mintMockNftCertificate({
      caseId: item._id.toString(),
      orgId: item.orgId,
      status,
    });
  }

  await item.save();
  res.json(item);
}

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  updateCaseStatus,
};

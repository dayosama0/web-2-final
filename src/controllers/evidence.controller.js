const EvidenceArtifact = require("../models/EvidenceArtifact");

async function getAllEvidence(req, res) {
  const items = await EvidenceArtifact.find().sort({ createdAt: -1 });
  res.json(items);
}

async function getEvidenceById(req, res) {
  const item = await EvidenceArtifact.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "EvidenceArtifact not found." });
  res.json(item);
}

async function getEvidenceByCaseId(req, res) {
  const items = await EvidenceArtifact.find({ caseId: req.params.caseId }).sort({ createdAt: -1 });
  res.json(items);
}

async function createEvidence(req, res) {
  const created = await EvidenceArtifact.create(req.body);
  res.status(201).json(created);
}

async function updateEvidence(req, res) {
  const updated = await EvidenceArtifact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: "EvidenceArtifact not found." });
  res.json(updated);
}

async function deleteEvidence(req, res) {
  const deleted = await EvidenceArtifact.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "EvidenceArtifact not found." });
  res.json({ success: true });
}

module.exports = {
  getAllEvidence,
  getEvidenceById,
  getEvidenceByCaseId,
  createEvidence,
  updateEvidence,
  deleteEvidence,
};
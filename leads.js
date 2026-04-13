const fs = require("fs");
const path = require("path");

const leadsFile = path.join(__dirname, "../data/leads.json");
const conversationsFile = path.join(__dirname, "../data/conversations.json");

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
}

function readJson(filePath) {
  ensureFile(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw || "[]");
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function saveLead(lead) {
  try {
    const leads = readJson(leadsFile);

    leads.push({
      ...lead,
      createdAt: new Date().toISOString()
    });

    writeJson(leadsFile, leads);
    console.log("Lead saved");
  } catch (err) {
    console.log("Lead save error:", err.message);
  }
}

function saveConversation(entry) {
  try {
    const conversations = readJson(conversationsFile);

    conversations.push({
      ...entry,
      createdAt: new Date().toISOString()
    });

    writeJson(conversationsFile, conversations);
    console.log("Conversation saved");
  } catch (err) {
    console.log("Conversation save error:", err.message);
  }
}

module.exports = {
  saveLead,
  saveConversation
};
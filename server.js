require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { handleChat } = require("./routes/chat.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", handleChat);

app.get("/api/leads", (req, res) => {
  try {
    const file = path.join(__dirname, "data/leads.json");

    if (!fs.existsSync(file)) {
      return res.json([]);
    }

    const data = fs.readFileSync(file, "utf-8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Solace server running on http://localhost:${PORT}`);
});
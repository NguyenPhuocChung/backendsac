const mongoose = require("mongoose");
const documentShema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  detail: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

module.exports = mongoose.model("Document", documentShema);

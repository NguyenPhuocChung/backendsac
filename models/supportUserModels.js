//supportUserModel.js
const mongoose = require("mongoose");

const supportUserSchema = new mongoose.Schema({
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SupportUser", supportUserSchema);

const mongoose = require("mongoose");
const userShema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"] },
  email: { type: String },
  address: { type: String },
  avatar: { type: String },
  status: { type: String, enum: ["active", "inactive"] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", userShema);

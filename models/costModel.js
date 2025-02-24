const mongoose = require("mongoose");

// Schema cho từng giao dịch chi tiêu
const spentTransactionSchema = new mongoose.Schema({
  description: { type: String, required: true }, // Mô tả giao dịch
  amountSpent: { type: Number, required: true }, // Số tiền đã chi
  createdAt: { type: Date, default: Date.now }, // Thời gian giao dịch
});

// Schema quản lý thu chi
const costSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Liên kết với tài khoản người dùng
      ref: "User",
      required: true,
    },
    spentHistory: [spentTransactionSchema], // Lịch sử giao dịch "Số tiền đã chi"
    totalReceived: { type: Number, default: 0 }, // Tổng số tiền đã thu
    totalBalance: { type: Number, default: 0 }, // Số dư hiện tại
  },
  { timestamps: true }
); // timestamps: tự động thêm createdAt và updatedAt

module.exports = mongoose.model("Cost", costSchema);

//userRoutes.js
const express = require("express");
const router = express.Router();
const {
  updateTransaction,
  getCurrentTransaction,
  clearTransactions,
} = require("../controller/costController");
const { getAllPonds } = require("../controller/pondController");
const {
  sendFeedback, // Import controller mới
} = require("../controller/suportUserController");
const {
  getAccountDetails,
  updateAccountInfo,
  changePassword,
  checkEmailExists,
  otpPassword,
  deleteUserAccount,
  verifyOTP,
  deleteUserById,
  sumUser,
} = require("../controller/userController");
const fakeAuthenticate = require("../midleware/fakeAutheticaton"); // Import fakeAuthenticate
// Lấy thông tin tài khoản
router.get("/account", fakeAuthenticate, getAccountDetails);

router.put("/account", fakeAuthenticate, updateAccountInfo);

// Cập nhật thông tin tài khoản (Không cần trùng với route trên)
router.post("/check-email-exists", checkEmailExists);

// Route gửi OTP
router.post("/send-otp", otpPassword);
router.post("/verify-otp", fakeAuthenticate, verifyOTP);

// Đổi mật khẩu
router.put("/change-password", fakeAuthenticate, changePassword);

// API xóa tài khoản
router.delete("/delete-account", fakeAuthenticate, deleteUserAccount);

// Sử dụng fakeAuthenticate thay cho authenticate
router.post("/costs", fakeAuthenticate, updateTransaction);
router.get("/costs", fakeAuthenticate, getCurrentTransaction);
router.delete("/costs", fakeAuthenticate, clearTransactions);

router.get("/ponds", fakeAuthenticate, getAllPonds);

router.delete("/deleteUser/:id", deleteUserById);
router.get("/sumUser", sumUser);

module.exports = router;

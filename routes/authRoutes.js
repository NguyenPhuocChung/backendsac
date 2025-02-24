const passport = require("passport");
const express = require("express");
const routes = express.Router();
const {
  register,
  login,
  verify,
  sendOTP,
  updatePasswordByEmail,
} = require("../controller/authController");
const { googleLogin } = require("../controller/authController");
const { createPond, getAllPonds } = require("../controller/pondController");
const { getAllDocuments } = require("../controller/documentController");

const {
  updateTransaction,
  getCurrentTransaction,
  clearTransactions,
} = require("../controller/costController");
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
  getAllUsers,
  deleteUserById,
  sumUser,
} = require("../controller/userController");
routes.post("/register", register);
routes.post("/login", login);
routes.post("/verify/:code", verify);
routes.post("/sendOtp/:email", sendOTP);
routes.put("/changePasswordByEmail", updatePasswordByEmail);

routes.post("/addNewPond", createPond);
routes.get("/pond", getAllPonds);
routes.get("/document", getAllDocuments);
const fakeAuthenticate = require("../midleware/fakeAutheticaton"); // Import fakeAuthenticate
// Lấy thông tin tài khoản
routes.get("/account", fakeAuthenticate, getAccountDetails);

routes.put("/account", fakeAuthenticate, updateAccountInfo);

// Cập nhật thông tin tài khoản (Không cần trùng với route trên)
routes.post("/check-email-exists", checkEmailExists);

// Route gửi OTP
routes.post("/send-otp", otpPassword);
routes.post("/verify-otp", fakeAuthenticate, verifyOTP);

// Đổi mật khẩu
routes.put("/change-password", fakeAuthenticate, changePassword);

// API xóa tài khoản
routes.delete("/delete-account", fakeAuthenticate, deleteUserAccount);

// Sử dụng fakeAuthenticate thay cho authenticate
routes.post("/costs", fakeAuthenticate, updateTransaction);
routes.get("/costs", fakeAuthenticate, getCurrentTransaction);
routes.delete("/costs", fakeAuthenticate, clearTransactions);

routes.get("/ponds", fakeAuthenticate, getAllPonds);

routes.post("/send-feedback", fakeAuthenticate, sendFeedback);
routes.get("/getALLUsers", getAllUsers);
routes.delete("/deleteUser/:id", deleteUserById);
routes.get("/sumUser", sumUser);

module.exports = routes;

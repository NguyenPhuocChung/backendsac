const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Thiết lập transporter của Nodemailer (Gửi Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chungnp160902@gmail.com", // Email gửi OTP
    pass: "fwbo fixz elfu arxu", // Mật khẩu ứng dụng Gmail
  },
});

// Đăng ký tài khoản
const register = async (req, res) => {
  const { userName, password, phoneNumber, email } = req.body;

  if (!userName || !password || !phoneNumber || !email) {
    return res.status(400).json({ message: "Vui lòng cung cấp đủ thông tin" });
  }

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: "Số điện thoại đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      password: hashedPassword,
      phoneNumber,
      email,
    });
    await newUser.save();

    return res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi trong quá trình đăng ký:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Gửi mã OTP qua Gmail
const sendOTP = async (req, res) => {
  const { email } = req.params;
  console.log("====================================");
  console.log(email);
  console.log("====================================");
  if (!email) {
    return res.status(400).json({ message: "Vui lòng cung cấp email" });
  }

  try {
    // Tạo mã OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Gửi email chứa OTP
    await transporter.sendMail({
      from: "chungnp160902@gmail.com", // Email gửi
      to: email, // Email nhận
      subject: "Mã OTP xác minh",
      text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
    });

    // Lưu OTP vào session (hoặc cơ sở dữ liệu nếu cần)
    req.session.otp = otp;
    req.session.otpExpires = Date.now() + 5 * 60 * 1000; // OTP hết hạn sau 5 phút

    return res.status(200).json({ message: "Gửi OTP thành công" });
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    return res
      .status(500)
      .json({ message: "Lỗi gửi OTP", error: error.message });
  }
};

// Xác minh mã OTP
const verify = async (req, res) => {
  const { code } = req.params;
  console.log("====================================");
  console.log(code);
  console.log("====================================");

  if (!code) {
    return res.status(400).json({ message: "Vui lòng nhập mã OTP" });
  }

  try {
    const sessionOtp = req.session.otp;
    const otpExpires = req.session.otpExpires;

    if (!sessionOtp || !otpExpires) {
      return res
        .status(400)
        .json({ message: "OTP không tồn tại hoặc đã hết hạn" });
    }

    if (Date.now() > otpExpires) {
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    if (code === sessionOtp) {
      return res.status(200).json({ message: "Xác minh OTP thành công" });
    } else {
      return res.status(401).json({ message: "Mã OTP không đúng" });
    }
  } catch (error) {
    console.error("Lỗi xác minh OTP:", error);
    return res
      .status(500)
      .json({ message: "Lỗi xác minh OTP", error: error.message });
  }
};
// Hàm đăng nhập
const login = async (req, res) => {
  const { userName, password } = req.body;
  console.log("====================================");
  console.log(userName, "password", password);
  console.log("====================================");
  try {
    // Tìm người dùng dựa trên email và role
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mặt khẩu bị sai!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mặt khẩu bị sai!" });
    }

    // Nếu thành công, trả về thông báo đăng nhập thành công
    res.status(200).json({
      message: "Đăng nhập thành công!",
      user: { id: user._id },
    });
  } catch (error) {
    console.error("Lỗi trong quá trình đăng nhập!", error);
    res.status(500).json({ message: "Lỗi mạng", error });
  }
};
//update password by email
const updatePasswordByEmail = async (req, res) => {
  const { email, newPassword } = req.body;
  console.log("====================================");
  console.log(email, newPassword);
  console.log("====================================");
  if (!newPassword) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp đây đủ thông tin" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
  } catch (error) {
    console.error("L��i trong quá trình cập nhật mật khẩu!", error);
    res.status(500).json({ message: "L��i mạng", error });
  }
};

module.exports = {
  register,
  sendOTP,
  verify,
  login,
  updatePasswordByEmail,
};

// userController.js
const Transaction = require("../models/userModels"); // Assuming you have a Transaction model
const User = require("../models/userModels"); // Đảm bảo dùng đúng mô hình User
const nodemailer = require("nodemailer");
// Import bcrypt
const bcrypt = require("bcryptjs");

// Hàm gửi OTP qua email
const sendOTP = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tinttce172062@fpt.edu.vn",
      pass: "gghl xbqa xvjl wvad", // Mật khẩu ứng dụng Gmail
    },
  });

  const mailOptions = {
    from: '"SAC - Shrimp Aqua Care" <tinttce172062@fpt.edu.vn>',
    to, // Địa chỉ email người nhận
    subject: "Mã OTP Xác Thực từ SAC - Shrimp Aqua Care",
    html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #f1f1f1; border-radius: 10px; background-color: #f9f9f9; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #008080;">SAC - Shrimp Aqua Care</h2>
            <p style="font-size: 16px; color: #555;">Chào bạn,</p>
            <p style="font-size: 16px; color: #555;">Đây là mã OTP để xác thực tài khoản của bạn:</p>
            <div style="display: inline-block; padding: 1px 38px; margin: 20px 0; font-size: 30px; color: #fff; background-color: #008080; border-radius: 8px; font-weight: bold; border: 2px solid #006666;white-space: nowrap;">
                ${otp}
            </div>
            <p style="font-size: 16px; color: #555;">Vui lòng nhập mã OTP này để tiếp tục quá trình đăng nhập hoặc thay đổi thông tin tài khoản của bạn.</p>
            <p style="font-size: 14px; color: #888;">Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này.</p>
        </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

// Hàm gửi email thông báo mật khẩu
const sendEmail = async (to, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tinttce172062@fpt.edu.vn", // Thay bằng email của bạn
      pass: "madw qbba mtuu ydqd", // Thay bằng mật khẩu ứng dụng của bạn
    },
  });

  const mailOptions = {
    // from: '"Công Ty CNHH 5 thành viên" <chungnp160902@gmail.com>',
    from: '"Công Ty CNHH 5 thành viên" <tinttce172062@fpt.edu.vn>',
    to,
    subject: "Thông tin tài khoản của bạn",
    html: `<p>Chào bạn nhoa,</p>
           <p>Tài khoản của bạn đã được tạo thành công.</p>
           <p><strong>Mật khẩu của bạn là: ${password}</strong></p>
           <p>Hãy đăng nhập và thay đổi mật khẩu ngay sau khi đăng nhập!</p>
           <p>Chúc bạn làm việc vui vẻ!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

// Hàm kiểm tra mật khẩu
const checkPassword = async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  console.log("====================================");
  console.log(`ID: ${id}, Password: ${password}`);
  console.log("====================================");

  if (!password || !id) {
    return res.status(400).json({ message: "Password and ID are required" });
  }

  try {
    // Tìm người dùng dựa trên ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // Nếu thành công, trả về thông tin người dùng
    res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error("Error checking password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Hàm gửi OTP và lưu vào session
const otpPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Tạo mã OTP ngẫu nhiên 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000);
    req.session.otp = otp; // Lưu OTP vào session

    // Gửi OTP đến email đã đăng ký
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Hàm xác thực OTP
const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  const userOtp = req.session.otp;

  // Kiểm tra OTP và email
  if (!otp || !email) {
    console.log("Missing OTP or email.");
    return res
      .status(400)
      .json({ success: false, message: "OTP and email are required" });
  }

  // Kiểm tra OTP
  if (String(otp) !== String(userOtp)) {
    console.log("Invalid OTP:", otp);
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // Kiểm tra hết hạn OTP
  if (Date.now() > req.session.otpExpiration) {
    console.log("OTP expired.");
    return res.status(400).json({ success: false, message: "OTP has expired" });
  }

  console.log("OTP valid, updating email...");

  try {
    // Cập nhật email trong cơ sở dữ liệu
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email: email },
      { new: true }
    );

    if (!user) {
      console.log("User not found.");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Hủy session
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error destroying session" });
      }
    });

    console.log("Email updated successfully for user:", user);
    res
      .status(200)
      .json({ success: true, message: "Email updated successfully!" }); // Thành công
  } catch (error) {
    console.log("Error verifying OTP and updating email:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Hàm kiểm tra email đã tồn tại
const checkEmailExists = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        exists: false, // Email not found
        message: "Email not found",
      });
    }

    res.status(200).json({
      exists: true, // Email exists
      userId: user._id,
    });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller functions
const updateTransaction = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    // Example update logic
    const transaction = await Transaction.findOneAndUpdate(
      { userId },
      { $set: { amount } },
      { new: true }
    );
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCurrentTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clearTransactions = async (req, res) => {
  try {
    await Transaction.deleteMany();
    res.status(200).json({ message: "All transactions cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller để lấy chi tiết tài khoản
const getAccountDetails = async (req, res) => {
  console.log("====================================");
  console.log("chung");
  console.log("====================================");
  try {
    // Lấy thông tin người dùng từ MongoDB sử dụng userId
    const user = await User.findById(req.user.id); // Dùng req.user.id từ fakeAuthenticate

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin tài khoản
    res.status(200).json({
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin tài khoản
// const updateAccountInfo = async (req, res) => {
//     const { userName, phoneNumber, address, email, otp } = req.body;

//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Kiểm tra email có thay đổi và tồn tại hay không
//         if (email && email !== user.email) {
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({ message: "Email already exists" });
//             }

//             // Nếu email không tồn tại thì yêu cầu OTP
//             const userOtp = req.session.otp; // Lấy OTP từ session
//             if (String(otp) !== String(userOtp)) {
//                 return res.status(400).json({ message: "Invalid OTP" });
//             }

//             // Cập nhật email nếu OTP hợp lệ
//             user.email = email;
//         }

//         // Cập nhật các thông tin còn lại (userName, phoneNumber, address)
//         if (userName) user.userName = userName;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (address) user.address = address;

//         // Lưu lại thông tin cập nhật
//         await user.save();
//         res.status(200).json({ message: "Account updated successfully", user });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
const updateAccountInfo = async (req, res) => {
  const { userName, phoneNumber, address, email, otp } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra email có thay đổi và tồn tại hay không
    if (email && email !== user.email) {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Nếu email thay đổi, yêu cầu OTP
      const userOtp = req.session.otp; // Lấy OTP từ session
      if (!userOtp) {
        return res
          .status(400)
          .json({ message: "OTP not generated or expired" });
      }

      // Kiểm tra OTP
      if (String(otp) !== String(userOtp)) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Cập nhật email nếu OTP hợp lệ
      user.email = email;
    }

    // Cập nhật các thông tin còn lại (userName, phoneNumber, address)
    if (userName) user.userName = userName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;

    // Lưu lại thông tin cập nhật
    await user.save();
    res.status(200).json({ message: "Account updated successfully", user });
  } catch (err) {
    console.error(err); // Log lỗi để dễ dàng tìm hiểu nguyên nhân
    res.status(500).json({ message: err.message });
  }
};

// Hàm xóa tài khoản
const deleteUserAccount = async (req, res) => {
  try {
    // Lấy userId từ middleware xác thực (fakeAuthentication hoặc middleware thật)
    const userId = req.user.id;

    // Tìm và xóa người dùng khỏi cơ sở dữ liệu
    const user = await User.findByIdAndDelete(userId);

    // Kiểm tra nếu người dùng không tồn tại
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Thành công
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userName = req.user.userName; // Lấy tên người dùng từ fake authentication

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Tất cả các trường mật khẩu đều phải được điền đầy đủ.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Mật khẩu mới và mật khẩu xác nhận không khớp." });
  }

  if (newPassword === currentPassword) {
    return res
      .status(400)
      .json({ message: "Mật khẩu mới không thể giống mật khẩu cũ." });
  }

  try {
    // Lấy người dùng từ cơ sở dữ liệu
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại." });

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ message: "Mật khẩu đã được cập nhật thành công", userName });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." });
  }
};
// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//delete userbyid
const deleteUserById = async (req, res) => {
  console.log(req.params.id);
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//sum user
const sumUser = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  updateTransaction,
  getCurrentTransaction,
  clearTransactions,
  getAccountDetails,
  changePassword,
  updateAccountInfo,
  sendOTP,
  sendEmail,
  checkPassword,
  otpPassword,
  checkEmailExists,
  deleteUserAccount,
  verifyOTP,
  getAllUsers,
  deleteUserById,
  sumUser,
};

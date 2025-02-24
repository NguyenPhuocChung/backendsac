const nodemailer = require("nodemailer");
const SupportUser = require("../models/supportUserModels"); // Nếu cần lưu vào MongoDB

const sendFeedback = async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ message: "Phản hồi không được để trống!" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "tinttce172062@fpt.edu.vn",
    subject: "Phản hồi từ ứng dụng",
    text: feedback,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Phản hồi đã được gửi thành công!" });
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    res.status(500).json({ message: "Lỗi khi gửi phản hồi qua email." });
  }
};

module.exports = { sendFeedback };

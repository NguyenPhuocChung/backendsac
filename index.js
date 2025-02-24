const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const session = require("express-session");
app.use(express.json());
const passport = require("passport");
require("./config/googleAuth");

// app.use(passport.initialize());
// app.use(passport.session());
app.use(
  session({
    secret: "your-secret-key", // Thay bằng khóa bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Nếu sử dụng HTTPS, hãy đặt thành true
  })
);
const Host = process.env.HOST;

const corsOptions = {
  origin: ["http://localhost:3000", "http://192.168.1.4:5000"],
  methods: "GET,POST,PUT,DELETE", // Thêm các phương thức HTTP cần thiết
  credentials: true, // Nếu cần chia sẻ cookie hoặc session
};

app.use(cors(corsOptions));
//
const JWT_SECRET = process.env.JWT_SECRET;
const DBHost = process.env.DB_HOST;

mongoose
  .connect(DBHost)
  .then(() => console.log("Kết nối đến MongoDB thành công!"))
  .catch((error) => console.error("Lỗi kết nối:", error));
//
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

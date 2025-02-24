const Cost = require("../models/costModel");

// Cập nhật giao dịch (thêm tiền chi hoặc thu)
const updateTransaction = async (req, res) => {
  try {
    const { amountSpent, description, amountReceived } = req.body;
    const userId = req.user.id; // Lấy userId từ middleware xác thực

    // Tìm dữ liệu chi phí của người dùng
    let cost = await Cost.findOne({ userId });

    if (!cost) {
      // Nếu chưa có dữ liệu nào, tạo mới
      cost = new Cost({
        userId,
        spentHistory: [],
        totalReceived: 0,
        totalBalance: 0,
      });
    }

    // Thêm giao dịch chi tiêu vào lịch sử
    if (amountSpent && description) {
      const newTransaction = {
        description,
        amountSpent,
      };
      cost.spentHistory.push(newTransaction);
    }

    // Cập nhật tổng số tiền đã thu
    if (amountReceived) {
      cost.totalReceived += amountReceived;
    }

    // Tính lại số dư hiện tại
    cost.totalBalance =
      cost.totalReceived -
      cost.spentHistory.reduce((sum, item) => sum + item.amountSpent, 0);

    // Lưu thay đổi
    await cost.save();

    res.status(200).json({
      success: true,
      message: "Giao dịch đã được cập nhật",
      data: cost,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật giao dịch:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật giao dịch",
      error: error.message,
    });
  }
};

// Lấy dữ liệu hiện tại (số tiền đã chi, đã thu, và lịch sử giao dịch)
const getCurrentTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const cost = await Cost.findOne({ userId });

    if (!cost) {
      return res.status(200).json({
        success: true,
        data: {
          spentHistory: [],
          totalReceived: 0,
          totalBalance: 0,
        },
      });
    }

    // Tính toán `totalBalance` để xử lý giá trị âm nếu cần
    const totalBalance =
      (cost.totalReceived || 0) -
      cost.spentHistory.reduce((sum, item) => sum + (item.amountSpent || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        spentHistory: cost.spentHistory,
        totalReceived: cost.totalReceived || 0,
        totalBalance,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy dữ liệu",
    });
  }
};

// Xóa toàn bộ giao dịch
const clearTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ middleware xác thực

    // Tìm dữ liệu chi phí của người dùng
    const cost = await Cost.findOne({ userId });

    if (!cost) {
      return res.status(404).json({
        success: false,
        message: "Không có dữ liệu để xóa",
      });
    }

    // Xóa dữ liệu
    cost.spentHistory = []; // Xóa lịch sử chi tiêu
    cost.totalReceived = 0; // Đặt lại tổng tiền thu
    cost.totalBalance = 0; // Đặt lại số dư về 0

    // Lưu thay đổi vào cơ sở dữ liệu
    await cost.save();

    res.status(200).json({
      success: true,
      message: "Tất cả giao dịch đã được xóa",
      data: cost,
    });
  } catch (error) {
    console.error("Lỗi khi xóa giao dịch:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa giao dịch",
      error: error.message,
    });
  }
};
module.exports = {
  updateTransaction,
  getCurrentTransaction,
  clearTransactions,
};

const Payment = require('../entity/module/payment.model');

exports.getAll = async (req, res) => {
  try {
    const data = await Payment.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Payment.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const express = require("express");
const router = express.Router();
const payOS = require("../utils/payos");
exports.createPayment = async (req, res) => {
    console.log(req.body);
    // Tạo orderCode là số ngẫu nhiên 6 chữ số
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const timestamp = Date.now() % 1000000; // Lấy 6 chữ số cuối của timestamp
    const orderCode = Number(`${timestamp}${randomNum}`.slice(-9)); // Fixed orderCode generation
    
    const body = {
        orderCode,
        amount: 100000,
        description: 'Thanh toan don hang',
        returnUrl: `http://localhost:3000`,
        cancelUrl: `http://localhost:3000`
    };
    try {
        const paymentLinkResponse = await payOS.createPaymentLink(body);
        res.json({
            error: 0,
            message: "ok",
            url: paymentLinkResponse.checkoutUrl
        });
    } catch (error) {
        console.error(error);
        res.send('Something went error');
    }
};
// exports.callback = async (req, res) => {
//   try {
//     const { code, id, status, orderCode, userId, price, packageId } = req.query;
//     console.log("User data:", userId, packageId, price);
//     if (code === "00") {
//       const user = await Employer.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       if (user.Role !== "employer") {
//         return res.status(403).json({ message: "Only employers can subscribe to packages" });
//       }
    
//       // Kiểm tra xem payment_id đã tồn tại chưa
//       const paymentExists = user.UserSubcription?.some(sub => 
//         sub.Payment_info?.payment_id === orderCode
//       );
//       if (paymentExists) {
//         return res.status(400).json({ 
//           message: "Payment already processed",
//         });
//       }
//       // Khởi tạo mảng UserSubcription nếu chưa có
//       if (!Array.isArray(user.UserSubcription)) {
//         user.UserSubcription = [];
//       }
//       // Cập nhật status = false cho tất cả các gói cũ
//       user.UserSubcription = user.UserSubcription.map(sub => ({
//         ...sub,
//         status: false
//       }));
//       // Tạo subscription mới với status = true
//       const startDate = new Date();
//       const endDate = new Date(startDate);
//       endDate.setMonth(endDate.getMonth() + 1);
//       const newSubscription = {
//         packageId: packageId,
//         Start_date: startDate,
//         End_date: endDate,
//         status: true,
//         Payment_info: {
//           payment_id: orderCode,
//           amount: price || 0,
//           currency: "VND",
//           status: "completed",
//           method: "payOS",
//           date: new Date()
//         }
//       };
//       user.UserSubcription.push(newSubscription);
//       await user.save();
//       return res.status(200).json({ 
//         message: "Package subscribed successfully", 
//         subscription: newSubscription 
//       });
//     }
//     return res.status(200).json(req.query);
    
//   } catch (error) {
//     console.error("Callback error:", error);
//     return res.status(500).json({ 
//       message: "Error processing payment callback",
//       error: error.message 
//     });
//   }
// };
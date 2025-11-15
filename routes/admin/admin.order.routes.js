const express = require("express");
const { getPool } = require("../../config/db");
const { authenticateJWT, authorizeAdmin } = require("../../middleware/auth.middleware");

const router = express.Router();

// Lấy danh sách đơn hàng
router.get("/", authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const pool = await getPool();
    const query = `
  SELECT TOP 100
    o.Id, o.Total, o.PaymentMethod, o.Status, o.CreatedAt,
    u.Name AS CustomerName, u.Phone
  FROM Orders o
  JOIN Users u ON o.UserId = u.Id
  ORDER BY o.CreatedAt DESC
`;

    const result = await pool.request().query(query);
    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error("❌ Lỗi truy vấn đơn hàng:", err);
    res.status(500).json({ ok: false, error: "Lỗi máy chủ" });
  }
});
const AdminOrderController = require("../../controllers/admin/admin.order.controller");

router.patch("/:id/status", authenticateJWT, authorizeAdmin, AdminOrderController.updateStatus);

module.exports = router;

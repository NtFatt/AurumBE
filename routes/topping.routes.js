const express = require("express");
const router = express.Router();
const AdminToppingController = require("../controllers/admin/admin.topping.controller");

// ✅ Public route: chỉ đọc dữ liệu topping, không cần JWT
router.get("/", AdminToppingController.getAll);

module.exports = router;

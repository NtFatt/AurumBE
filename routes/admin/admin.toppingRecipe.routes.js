const express = require("express");
const { authenticateJWT, authorizeAdmin } = require("../../middleware/auth.middleware");
const AdminToppingRecipeController = require("../../controllers/admin/admin.toppingRecipe.controller");

const router = express.Router();

// Lấy công thức của 1 topping
router.get("/:toppingId", authenticateJWT, authorizeAdmin, AdminToppingRecipeController.getByToppingId);

// Thêm nguyên liệu vào công thức
router.post("/", authenticateJWT, authorizeAdmin, AdminToppingRecipeController.addIngredient);

// Cập nhật số lượng nguyên liệu
router.put("/", authenticateJWT, authorizeAdmin, AdminToppingRecipeController.updateQuantity);

// Xóa nguyên liệu khỏi công thức
router.delete("/:toppingId/:inventoryId", authenticateJWT, authorizeAdmin, AdminToppingRecipeController.deleteIngredient);

module.exports = router;

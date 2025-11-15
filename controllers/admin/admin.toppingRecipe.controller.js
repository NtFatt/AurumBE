const AdminToppingRecipeService = require("../../services/admin/admin.toppingRecipe.service");

class AdminToppingRecipeController {
  // Lấy toàn bộ công thức của 1 topping
  static async getByToppingId(req, res) {
    try {
      const { toppingId } = req.params;
      const data = await AdminToppingRecipeService.getByToppingId(toppingId);
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }

  // Thêm nguyên liệu vào công thức topping
  static async addIngredient(req, res) {
    try {
      const result = await AdminToppingRecipeService.addIngredient(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  }

  // Cập nhật lượng nguyên liệu trong công thức topping
  static async updateQuantity(req, res) {
    try {
      const result = await AdminToppingRecipeService.updateQuantity(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  }

  // Xóa nguyên liệu khỏi công thức topping
  static async deleteIngredient(req, res) {
    try {
      const { toppingId, inventoryId } = req.params;
      const result = await AdminToppingRecipeService.deleteIngredient(toppingId, inventoryId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  }
}

module.exports = AdminToppingRecipeController;

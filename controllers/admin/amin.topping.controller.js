const AdminToppingService = require("../../services/admin/admin.topping.service");

class AdminToppingController {
  // Lấy toàn bộ topping
  static async getAll(req, res) {
    try {
      const data = await AdminToppingService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Lấy topping theo Id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const topping = await AdminToppingService.getById(id);
      res.json(topping);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  // Tạo mới topping
  static async create(req, res) {
    try {
      const body = req.body;
      const data = {
        Name: body.Name || body.name,
        Description: body.Description || body.description,
        Price: body.Price || body.price,
        CategoryName: body.CategoryName || body.categoryName,
        ImageUrl: body.ImageUrl || body.imageUrl,
      };
      const result = await AdminToppingService.create(data);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Cập nhật topping
  static async update(req, res) {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = {
        Name: body.Name || body.name,
        Description: body.Description || body.description,
        Price: body.Price || body.price,
        CategoryName: body.CategoryName || body.categoryName,
        ImageUrl: body.ImageUrl || body.imageUrl,
      };
      const result = await AdminToppingService.update(id, data);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }


  // Xóa topping
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await AdminToppingService.delete(id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = AdminToppingController;

const { sql, getPool } = require("../../config/db");

class AdminToppingRecipeService {
  // ======================================================
  // 🟢 Lấy toàn bộ công thức của 1 topping
  // ======================================================
  static async getByToppingId(toppingId) {
    const pool = await getPool();
    const res = await pool
      .request()
      .input("ToppingId", sql.Int, toppingId)
      .query(`
        SELECT 
          tr.ToppingId,
          tr.InventoryId,
          i.Name AS InventoryName,
          tr.QuantityPerTopping,
          i.Unit
        FROM ToppingRecipes tr
        JOIN Inventories i ON tr.InventoryId = i.Id
        WHERE tr.ToppingId = @ToppingId
      `);

    return res.recordset;
  }

  // ======================================================
  // ➕ Thêm nguyên liệu vào công thức topping
  // ======================================================
  static async addIngredient({ ToppingId, InventoryId, QuantityPerTopping }) {
    const pool = await getPool();
    await pool
      .request()
      .input("ToppingId", sql.Int, ToppingId)
      .input("InventoryId", sql.Int, InventoryId)
      .input("QuantityPerTopping", sql.Decimal(10, 2), QuantityPerTopping)
      .query(`
        INSERT INTO ToppingRecipes (ToppingId, InventoryId, QuantityPerTopping)
        VALUES (@ToppingId, @InventoryId, @QuantityPerTopping)
      `);
    return { ok: true, message: "✅ Đã thêm nguyên liệu vào công thức topping" };
  }

  // ======================================================
  // ✏️ Cập nhật lượng nguyên liệu trong công thức
  // ======================================================
  static async updateQuantity({ ToppingId, InventoryId, QuantityPerTopping }) {
    const pool = await getPool();
    await pool
      .request()
      .input("ToppingId", sql.Int, ToppingId)
      .input("InventoryId", sql.Int, InventoryId)
      .input("QuantityPerTopping", sql.Decimal(10, 2), QuantityPerTopping)
      .query(`
        UPDATE ToppingRecipes
        SET QuantityPerTopping = @QuantityPerTopping
        WHERE ToppingId = @ToppingId AND InventoryId = @InventoryId
      `);
    return { ok: true, message: "✅ Đã cập nhật công thức topping" };
  }

  // ======================================================
  // 🗑️ Xóa nguyên liệu khỏi công thức
  // ======================================================
  static async deleteIngredient(toppingId, inventoryId) {
    const pool = await getPool();
    await pool
      .request()
      .input("ToppingId", sql.Int, toppingId)
      .input("InventoryId", sql.Int, inventoryId)
      .query(`
        DELETE FROM ToppingRecipes
        WHERE ToppingId = @ToppingId AND InventoryId = @InventoryId
      `);
    return { ok: true, message: "🗑️ Đã xóa nguyên liệu khỏi công thức topping" };
  }
}

module.exports = AdminToppingRecipeService;

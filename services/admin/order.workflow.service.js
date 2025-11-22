const { sql, getPool } = require("../../config/db");

class OrderWorkflowService {

  // ======================================================
  // CẬP NHẬT TRẠNG THÁI ĐƠN
  // ======================================================
  async updateStatus(orderId, status) {
    const pool = await getPool();

    // Cập nhật Orders
    await pool.request()
      .input("Id", sql.Int, orderId)
      .input("Status", sql.NVarChar(50), status)
      .query(`
        UPDATE Orders
        SET Status = @Status
        WHERE Id = @Id
      `);

    // Ghi lịch sử
    await pool.request()
      .input("OrderId", sql.Int, orderId)
      .input("NewStatus", sql.NVarChar(50), status)
      .query(`
        INSERT INTO OrderHistory (OrderId, NewStatus)
        VALUES (@OrderId, @NewStatus)
      `);

    return true;
  }

  // ======================================================
  // BARISTA LẤY DANH SÁCH ĐƠN CẦN PHA CHẾ
  // ======================================================
  async getBaristaOrders(storeId = null) {
    const pool = await getPool();

    const rs = await pool.request().query(`
      SELECT 
        o.Id,
        o.CustomerName,
        o.Status,
        o.Type,
        o.CreatedAt,
        (
          SELECT 
            od.ProductName,
            od.Size,
            od.Quantity,
            od.Notes
          FROM OrderDetails od
          WHERE od.OrderId = o.Id
          FOR JSON PATH
        ) AS Items
      FROM Orders o
      WHERE o.Status IN ('Pending', 'Accepted', 'Making')
      ORDER BY o.CreatedAt DESC
    `);

    // Convert JSON
    const data = rs.recordset.map(o => ({
      ...o,
      Items: JSON.parse(o.Items || "[]")
    }));

    return data;
  }

  // ======================================================
  // TỰ ĐỘNG TRỪ KHO KHI HOÀN THÀNH ĐƠN
  // ======================================================
  async autoDeductIngredients(orderId) {
    const pool = await getPool();

    const items = await pool.request()
      .input("OrderId", sql.Int, orderId)
      .query(`
        SELECT ProductId, Quantity
        FROM OrderDetails
        WHERE OrderId = @OrderId
      `);

    for (const item of items.recordset) {

      const recipe = await pool.request()
        .input("ProductId", sql.Int, item.ProductId)
        .query(`
          SELECT IngredientId, Amount
          FROM DrinkRecipes
          WHERE ProductId = @ProductId
        `);

      for (const ing of recipe.recordset) {
        await pool.request()
          .input("IngredientId", sql.Int, ing.IngredientId)
          .input("Used", sql.Float, ing.Amount * item.Quantity)
          .query(`
            UPDATE Inventory
            SET Stock = Stock - @Used
            WHERE IngredientId = @IngredientId
          `);
      }
    }

    return true;
  }
}

module.exports = new OrderWorkflowService();

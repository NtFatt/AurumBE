const { sql, getPool } = require("../../config/db");

class OrderWorkflowService {

  async updateStatus(orderId, status) {
    const pool = await getPool();

    await pool.request()
      .input("Id", sql.Int, orderId)
      .input("Status", sql.NVarChar(50), status)
      .query(`
        UPDATE Orders
        SET Status = @Status
        WHERE Id = @Id
      `);

    await pool.request()
      .input("OrderId", sql.Int, orderId)
      .input("NewStatus", sql.NVarChar(50), status)
      .query(`
        INSERT INTO OrderHistory (OrderId, NewStatus)
        VALUES (@OrderId, @NewStatus)
      `);

    return true;
  }

  // ===============================
  // BARISTA LẤY ĐƠN
  // ===============================
  // ===============================
  // BARISTA LẤY ĐƠN
  // ===============================
async getBaristaOrders() {
  const pool = await getPool();

  const rs = await pool.request().query(`
      SELECT 
        o.Id,
        o.UserId,
        o.Total,
        o.Status,
        o.PaymentStatus,
        o.CreatedAt,

        (
          SELECT 
            p.Name AS ProductName,
            od.Quantity,
            od.UnitPrice AS Price,
            od.Size,
            od.Toppings,
            od.Sugar,
            od.Ice
          FROM OrderDetails od
          JOIN Products p ON p.Id = od.ProductId
          WHERE od.OrderId = o.Id
          FOR JSON PATH
        ) AS Items

      FROM Orders o
      WHERE o.Status IN ('waiting','preparing')
      ORDER BY o.CreatedAt ASC
  `);

  return rs.recordset.map(o => ({
    ...o,
    Items: JSON.parse(o.Items || "[]")
  }));
}


  // ===============================
  // TRỪ KHO
  // ===============================
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

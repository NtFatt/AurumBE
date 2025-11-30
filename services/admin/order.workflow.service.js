const { sql, getPool } = require("../../config/db");

class WorkflowService {

  async updateStatus(orderId, status) {
    const pool = await getPool();

    await pool.request()
      .input("orderId", orderId)
      .input("status", status)
      .query(`
        UPDATE Orders
        SET Status = @status
        WHERE Id = @orderId
      `);

    return { orderId, status };
  }

  async autoDeductIngredients(orderId) {
    const pool = await getPool();
    await pool.request()
      .input("orderId", orderId)
      .query("EXEC AutoDeductIngredients @orderId");
  }

  async getBaristaOrders(storeId) {
    const pool = await getPool();

    const qs = `
      SELECT 
        o.Id AS OrderId,
        o.OrderNumber,
        o.Total,
        o.Status,
        o.CreatedAt,

        od.Id AS DetailId,
        od.Quantity,
        od.UnitPrice,

        p.Name AS ProductName
        , o.FulfillmentMethod

      FROM Orders o
      JOIN OrderDetails od ON o.Id = od.OrderId
      JOIN Products p ON od.ProductId = p.Id
      WHERE o.Status IN ('waiting', 'preparing', 'brewing')
        AND (@storeId IS NULL OR o.StoreId = @storeId)
      ORDER BY o.CreatedAt DESC
    `;
    const rs = await pool.request()
      .input("storeId", storeId)
      .query(qs);


    const raw = rs.recordset;
    const orders = {};

    raw.forEach((r, index) => {
      if (!orders[r.OrderId]) {
        orders[r.OrderId] = {
          id: r.OrderId,
          orderNumber: r.OrderNumber,
          total: r.Total,
          status: r.Status?.toLowerCase() || "unknown",
          createdAt: r.CreatedAt,

          fulfillmentMethod: r.FulfillmentMethod || "AtStore",

          items: []
        };
      }



      orders[r.OrderId].items.push({
        id: r.DetailId, // ghi log rõ để kiểm tra undefined
        name: r.ProductName,
        size: null,
        quantity: r.Quantity,
        price: r.UnitPrice,
        toppings: []
      });
    });

    const finalResult = Object.values(orders);
    return finalResult;
  }
}

module.exports = new WorkflowService();

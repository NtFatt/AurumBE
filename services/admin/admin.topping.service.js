// ======================================================
// 📦 AdminToppingService.js
// ------------------------------------------------------
// ✅ Quản lý topping trong bảng Toppings
// ======================================================

const { sql, getPool } = require("../../config/db");

class AdminToppingService {
    // ======================================================
    // 🟢 Lấy toàn bộ danh sách topping
    // ======================================================
    static async getAll() {
        const pool = await getPool();
        const res = await pool.request().query(`
      SELECT 
        Id,
        Name,
        Description,
        Price,
        CategoryName,
        ImageUrl
      FROM Toppings
      ORDER BY Id DESC
    `);
        return res.recordset.map((t) => ({
            id: t.Id,
            name: t.Name,
            description: t.Description,
            price: t.Price,
            categoryName: t.CategoryName,
            imageUrl: t.ImageUrl,
        }));
    }

    // ======================================================
    // 🔍 Lấy chi tiết topping theo Id
    // ======================================================
    static async getById(id) {
        const pool = await getPool();
        const res = await pool
            .request()
            .input("Id", sql.Int, id)
            .query(`
        SELECT 
          Id, Name, Description, Price, CategoryName, ImageUrl
        FROM Toppings
        WHERE Id = @Id
      `);
        if (!res.recordset.length) throw new Error("Không tìm thấy topping");
        return res.recordset[0];
    }

    // ======================================================
    // ➕ Thêm topping mới
    // ======================================================
    static async create({ Name, Description, Price, CategoryName, ImageUrl }) {
        const pool = await getPool();
        const result = await pool
            .request()
            .input("Name", sql.NVarChar(255), Name)
            .input("Description", sql.NVarChar(sql.MAX), Description || "")
            .input("Price", sql.Decimal(18, 2), Price || 0)
            .input("CategoryName", sql.NVarChar(100), CategoryName || "Chưa phân loại")
            .input("ImageUrl", sql.NVarChar(500), ImageUrl || "")
            .query(`
      INSERT INTO Toppings (Name, Description, Price, CategoryName, ImageUrl)
      OUTPUT INSERTED.Id AS NewId
      VALUES (@Name, @Description, @Price, @CategoryName, @ImageUrl)
    `);

        const newId = result.recordset[0].NewId;
        return { ok: true, message: "✅ Đã thêm topping mới", id: newId };
    }

    // ======================================================
    // ✏️ Cập nhật thông tin topping
    // ======================================================
    static async update(id, { Name, Description, Price, CategoryName, ImageUrl }) {
        const pool = await getPool();
        await pool
            .request()
            .input("Id", sql.Int, id)
            .input("Name", sql.NVarChar(255), Name)
            .input("Description", sql.NVarChar(sql.MAX), Description || "")
            .input("Price", sql.Decimal(18, 2), Price || 0)
            .input("CategoryName", sql.NVarChar(100), CategoryName || "Chưa phân loại")
            .input("ImageUrl", sql.NVarChar(500), ImageUrl || "")
            .query(`
        UPDATE Toppings
        SET 
          Name = @Name,
          Description = @Description,
          Price = @Price,
          CategoryName = @CategoryName,
          ImageUrl = @ImageUrl
        WHERE Id = @Id
      `);
        return { ok: true, message: "✅ Cập nhật topping thành công" };
    }

    // ======================================================
    // 🗑️ Xóa topping
    // ======================================================
    static async delete(id) {
        const pool = await getPool();
        await pool
            .request()
            .input("Id", sql.Int, id)
            .query(`DELETE FROM Toppings WHERE Id = @Id`);
        return { ok: true, message: "🗑️ Đã xóa topping" };
    }
}

module.exports = AdminToppingService;

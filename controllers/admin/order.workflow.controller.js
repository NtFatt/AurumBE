const WorkflowService = require("../../services/admin/order.workflow.service");

class OrderWorkflowController {

  async accept(req, res) {
    const id = req.params.id;
    const result = await WorkflowService.updateStatus(id, "Accepted");
    res.json({ ok: true, status: "Accepted", result });
  }

  async toMaking(req, res) {
    const id = req.params.id;
    const result = await WorkflowService.updateStatus(id, "Making");
    res.json({ ok: true, status: "Making", result });
  }

  async completeByBarista(req, res) {
    const id = req.params.id;
    const result = await WorkflowService.updateStatus(id, "CompletedByBarista");
    res.json({ ok: true, status: "CompletedByBarista", result });
  }

  async done(req, res) {
    const id = req.params.id;
    await WorkflowService.updateStatus(id, "Done");
    await WorkflowService.autoDeductIngredients(id);
    res.json({ ok: true, status: "Done" });
  }

  // ============================
  // BARISTA LẤY DANH SÁCH ĐƠN
  // ============================
  async getBaristaOrders(req, res) {
    try {
      const storeId = req.user.StoreId || null;  // tùy token của bạn
      const orders = await WorkflowService.getBaristaOrders(storeId);

      return res.json({
        ok: true,
        data: orders,
      });
    } catch (error) {
      console.error("[getBaristaOrders] ERROR:", error);
      return res.status(500).json({
        ok: false,
        message: "Lỗi server khi lấy danh sách đơn cho Barista",
      });
    }
  }
}

module.exports = new OrderWorkflowController();

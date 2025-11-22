const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("../../middleware/auth.middleware");
const { authorizeEmployee } = require("../../middleware/employee.middleware");
const WorkflowController = require("../../controllers/admin/order.workflow.controller");

// bắt buộc login
router.use(authenticateJWT);

// BARISTA lấy đơn
router.get(
  "/barista-orders",
  authorizeEmployee(["barista", "admin"]),
  WorkflowController.getBaristaOrders
);

// CASHIER gửi đơn sang Barista
router.patch(
  "/:id/to-making",
  authorizeEmployee(["cashier", "admin"]),
  WorkflowController.toMaking
);

// BARISTA hoàn tất
router.patch(
  "/:id/complete-by-barista",
  authorizeEmployee(["barista", "admin"]),
  WorkflowController.completeByBarista
);

// CASHIER chốt đơn
router.patch(
  "/:id/done",
  authorizeEmployee(["cashier", "admin"]),
  WorkflowController.done
);

module.exports = router;

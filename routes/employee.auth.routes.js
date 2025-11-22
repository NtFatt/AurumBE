const router = require("express").Router();
const EmployeeAuthController = require("../../controllers/employee/employee.auth.controller");

router.post("/login", EmployeeAuthController.login);
router.post("/register", EmployeeAuthController.register);

module.exports = router;

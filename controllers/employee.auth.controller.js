const EmployeeService = require("../../services/employee.service");

exports.login = async (req, res) => {
  try {
    const data = await EmployeeService.login(req.body);
    res.json({ ok: true, ...data });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const data = await EmployeeService.createEmployee(req.body);
    res.json({ ok: true, ...data });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

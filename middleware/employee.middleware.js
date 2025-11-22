const jwt = require("jsonwebtoken");

const EMPLOYEE_JWT_SECRET = process.env.EMPLOYEE_JWT_SECRET || process.env.JWT_SECRET;

// =============================================================
// 🔐 Authenticate Employee Token (Barista / Cashier)
// =============================================================
function authenticateEmployeeJWT(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token provided" });

    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token)
      return res.status(401).json({ error: "Invalid token format" });

    const decoded = jwt.verify(token, EMPLOYEE_JWT_SECRET);

    req.user = decoded;  // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized employee" });
  }
}

// =============================================================
// 🔐 Authorize Employee Role (barista / cashier / admin)
// =============================================================
function authorizeEmployee(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: "Not authenticated" });

    const role = req.user.role?.toLowerCase();

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: `Role '${role}' không có quyền truy cập`
      });
    }

    next();
  };
}

module.exports = {
  authenticateEmployeeJWT,
  authorizeEmployee
};

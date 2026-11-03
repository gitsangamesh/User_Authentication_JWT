const pool = require("../config/db");

async function getProfile(req, res) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "User account not found." });
    }
    return res.json({ user: rows[0] });
  } catch (error) {
    console.error("Profile error:", error.message);
    return res.status(500).json({ message: "Unable to load profile." });
  }
}

module.exports = { getProfile };

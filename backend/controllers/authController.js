import db from "../config/db.js";
import bcrypt from "bcrypt";

// =======================
// LOGIN
// =======================
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi",
    });
  }

  const sql = "SELECT * FROM user WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    const user = result[0];

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    // Hapus password sebelum dikirim ke frontend
    delete user.password;

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      user,
    });
  });
};

// =======================
// GET PROFILE
// =======================
export const getProfile = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      id_user,
      nama,
      email,
      role
    FROM user
    WHERE id_user = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      user: result[0],
    });
  });
};

// =======================
// UPDATE PROFILE
// =======================
export const updateProfile = async (req, res) => {
  const { id } = req.params;

  const { nama, email, password } = req.body;

  try {
    let sql;
    let values;

    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 10);

      sql = `
        UPDATE user
        SET
          nama=?,
          email=?,
          password=?
        WHERE id_user=?
      `;

      values = [nama, email, hash, id];
    } else {
      sql = `
        UPDATE user
        SET
          nama=?,
          email=?
        WHERE id_user=?
      `;

      values = [nama, email, id];
    }

    db.query(sql, values, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Profil berhasil diperbarui",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

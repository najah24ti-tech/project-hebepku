import db from "../config/db.js";
import bcrypt from "bcrypt";

// =============================
// GET ALL USER
// =============================
export const getUsers = (req, res) => {
  const sql = `
    SELECT
      id_user,
      nama,
      email,
      role,
      is_active,
      created_at,
      updated_at
    FROM user
    ORDER BY id_user ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
};

// =============================
// CREATE USER
// =============================
export const createUser = async (req, res) => {
  try {
    const { nama, email, password, role, is_active } = req.body;

    const cekEmail = "SELECT * FROM user WHERE email=?";

    db.query(cekEmail, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email sudah digunakan",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO user
        (
          nama,
          email,
          password,
          role,
          is_active
        )
        VALUES (?,?,?,?,?)
      `;

      db.query(sql, [nama, email, hashPassword, role, is_active], (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        res.json({
          success: true,
          message: "User berhasil ditambahkan",
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// UPDATE USER
// =============================
export const updateUser = (req, res) => {
  const { id } = req.params;

  const { nama, email, role, is_active } = req.body;

  const sql = `
    UPDATE user
    SET
      nama=?,
      email=?,
      role=?,
      is_active=?
    WHERE id_user=?
  `;

  db.query(sql, [nama, email, role, is_active, id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "User berhasil diupdate",
    });
  });
};

// =============================
// DELETE USER
// =============================
export const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM user
    WHERE id_user=?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "User berhasil dihapus",
    });
  });
};

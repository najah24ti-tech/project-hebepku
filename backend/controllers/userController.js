import db from "../config/db.js";
import bcrypt from "bcrypt";

// =============================
// GET ALL USER
// =============================
export const getUsers = (req, res) => {
  const sql = `
    SELECT
      u.id_user,
      u.nama,
      u.email,
      u.role,
      u.id_wilayah,
      w.nama_wilayah,
      u.is_active,
      u.created_at,
      u.updated_at
    FROM user u
    LEFT JOIN wilayah w
      ON u.id_wilayah = w.id_wilayah
    ORDER BY u.id_user ASC
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
    console.log(req.body);

    const { nama, email, password, role, id_wilayah, is_active } = req.body;

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
          id_wilayah,
          is_active
        )
        VALUES (?,?,?,?,?,?)
      `;

      db.query(
        sql,
        [nama, email, hashPassword, role, id_wilayah || null, is_active],
        (err) => {
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
        },
      );
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

  const { nama, email, role, id_wilayah, is_active } = req.body;

  const sql = `
    UPDATE user
    SET
      nama=?,
      email=?,
      role=?,
      id_wilayah=?,
      is_active=?
    WHERE id_user=?
  `;

  db.query(
    sql,
    [nama, email, role, id_wilayah || null, is_active, id],
    (err) => {
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
    },
  );
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

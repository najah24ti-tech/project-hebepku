import db from "../config/db.js";

export const getWilayah = (req, res) => {
  db.query("SELECT * FROM wilayah", (err, result) => {
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
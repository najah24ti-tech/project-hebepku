import db from "../config/db.js";

export const getLaporan = (req, res) => {
  const { awal, akhir } = req.query;

  let sql = `
        SELECT
            tanggal_penjualan,
            SUM(total) AS total_penjualan,
            SUM(jumlah) AS total_produk
        FROM penjualan
    `;

  let params = [];

  if (awal && akhir) {
    sql += " WHERE tanggal_penjualan BETWEEN ? AND ?";
    params.push(awal, akhir);
  }

  sql += `
        GROUP BY tanggal_penjualan
        ORDER BY tanggal_penjualan ASC
    `;

  db.query(sql, params, (err, result) => {
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
export const getBulanan = (req, res) => {
  const sql = `
    SELECT
      DATE_FORMAT(tanggal_penjualan,'%Y-%m') AS bulan,
      SUM(total) AS total
    FROM penjualan
    GROUP BY DATE_FORMAT(tanggal_penjualan,'%Y-%m')
    ORDER BY bulan ASC
  `;

  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });

    res.json({
      success: true,
      data: result,
    });
  });
};
export const getBrand = (req, res) => {
  const sql = `
    SELECT
      b.nama_brand,
      SUM(p.total) AS total
    FROM penjualan p
    JOIN brand b
    ON p.id_brand=b.id_brand
    GROUP BY b.id_brand
  `;

  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });

    res.json({
      success: true,
      data: result,
    });
  });
};
export const getKategori = (req, res) => {
  const sql = `
    SELECT
      k.nama_kategori,
      SUM(p.total) AS total
    FROM penjualan p
    JOIN kategori k
    ON p.id_kategori=k.id_kategori
    GROUP BY k.id_kategori
  `;

  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });

    res.json({
      success: true,
      data: result,
    });
  });
};

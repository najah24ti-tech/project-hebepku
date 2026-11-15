import db from "../config/db.js";
import ExcelJS from "exceljs";

// =========================
// LAPORAN HARIAN
// =========================
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

// =========================
// GRAFIK BULANAN
// =========================
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

// =========================
// GRAFIK BRAND
// =========================
export const getBrand = (req, res) => {
  const sql = `
    SELECT
      b.nama_brand,
      SUM(p.total) AS total
    FROM penjualan p
    JOIN brand b
      ON p.id_brand = b.id_brand
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

// =========================
// GRAFIK KATEGORI
// =========================
export const getKategori = (req, res) => {
  const sql = `
    SELECT
      k.nama_kategori,
      SUM(p.total) AS total
    FROM penjualan p
    JOIN kategori k
      ON p.id_kategori = k.id_kategori
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

// =========================
// EXPORT EXCEL
// =========================
export const exportExcel = (req, res) => {
  const sql = `
    SELECT
      p.tanggal_penjualan,
      b.nama_brand,
      k.nama_kategori,
      p.nama_produk,
      p.nama_toko,
      p.jumlah,
      p.harga,
      p.total
    FROM penjualan p
    JOIN brand b
      ON p.id_brand = b.id_brand
    JOIN kategori k
      ON p.id_kategori = k.id_kategori
    ORDER BY p.tanggal_penjualan ASC
  `;

  db.query(sql, async (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Penjualan");

    worksheet.columns = [
      { header: "Tanggal", key: "tanggal_penjualan", width: 18 },
      { header: "Brand", key: "nama_brand", width: 20 },
      { header: "Kategori", key: "nama_kategori", width: 20 },
      { header: "Produk", key: "nama_produk", width: 25 },
      { header: "Nama Toko", key: "nama_toko", width: 20 },
      { header: "Jumlah", key: "jumlah", width: 12 },
      { header: "Harga", key: "harga", width: 15 },
      { header: "Total", key: "total", width: 18 },
    ];

    result.forEach((item) => {
      worksheet.addRow(item);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Laporan_Penjualan.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};

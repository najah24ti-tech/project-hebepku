import db from "../config/db.js";

// ======================================
// DASHBOARD OWNER - SUMMARY + FILTER
// ======================================

export const getDashboardOwner = (req, res) => {
  const sql = `
        SELECT
    p.id_penjualan,
    p.id_user,
    p.tanggal_penjualan,
    p.nama_produk,
    p.nama_toko,
    p.jumlah,
    p.total,

    b.nama_brand,
    w.nama_wilayah,
    k.nama_kategori,

    u.nama AS nama_ba

        FROM penjualan p

        JOIN brand b
            ON p.id_brand = b.id_brand

        JOIN kategori k
            ON p.id_kategori = k.id_kategori

        JOIN wilayah w
            ON p.id_wilayah = w.id_wilayah

        JOIN user u
            ON p.id_user = u.id_user

        ORDER BY p.tanggal_penjualan DESC
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

// ===============================
// GRAFIK PENJUALAN BULANAN OWNER
// ===============================

export const getChartPenjualan = (req, res) => {
  const sql = `

SELECT

DATE_FORMAT(
tanggal_penjualan,
'%Y-%m'
)
AS bulan,


SUM(total)
AS total_penjualan


FROM penjualan


GROUP BY

DATE_FORMAT(
tanggal_penjualan,
'%Y-%m'
)


ORDER BY bulan ASC;


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

// ======================================
// DETAIL TRANSAKSI DASHBOARD
// ======================================

export const getDetailPenjualanDashboard = (req, res) => {
  const sql = `


SELECT

    p.id_penjualan,

    p.tanggal_penjualan,

    p.nama_produk,

    p.nama_toko,

    p.jumlah,

    p.total,


    b.nama_brand,

    w.nama_wilayah,

    k.nama_kategori,

    u.nama AS nama_ba



FROM penjualan p



JOIN brand b

ON p.id_brand=b.id_brand



JOIN wilayah w

ON p.id_wilayah=w.id_wilayah



JOIN kategori k

ON p.id_kategori=k.id_kategori



JOIN user u

ON p.id_user=u.id_user



ORDER BY p.tanggal_penjualan DESC



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

// ======================================
// PENJUALAN BERDASARKAN BRAND
// ======================================

export const getPenjualanBrand = (req, res) => {
  const sql = `


SELECT


b.nama_brand,


SUM(p.total) AS total



FROM penjualan p



JOIN brand b

ON p.id_brand=b.id_brand



GROUP BY b.id_brand



ORDER BY total DESC



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

// ======================================
// PENJUALAN BERDASARKAN WILAYAH
// ======================================

export const getPenjualanWilayah = (req, res) => {
  const sql = `


SELECT


w.nama_wilayah,


SUM(p.total) AS total



FROM penjualan p



JOIN wilayah w

ON p.id_wilayah=w.id_wilayah



GROUP BY w.id_wilayah



ORDER BY total DESC



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

export const getDashboardSummary = (req, res) => {
  const sql = `

SELECT

COUNT(id_penjualan) AS total_transaksi,

SUM(jumlah) AS total_produk,

SUM(total) AS total_penjualan


FROM penjualan

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

      summary: result[0],
    });
  });
};
export const getDashboardChart = (req, res) => {
  const sql = `
    SELECT
      DATE_FORMAT(tanggal_penjualan,'%Y-%m') AS bulan,
      SUM(total) AS total_penjualan
    FROM penjualan
    GROUP BY DATE_FORMAT(tanggal_penjualan,'%Y-%m')
    ORDER BY bulan ASC
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

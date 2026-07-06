import db from "../config/db.js";

// ==============================
// GET Semua Penjualan
// ==============================
export const getPenjualan = (req, res) => {
  const sql = `
    SELECT
      p.id_penjualan,
      p.nama_produk,
      p.nama_toko,
      p.jumlah,
      p.harga,
      p.total,
      p.tanggal_penjualan,

      b.nama_brand,
      k.nama_kategori,
      w.nama_wilayah,

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

    ORDER BY p.tanggal_penjualan DESC;
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
// ==============================
// POST Tambah Penjualan
// ==============================
export const tambahPenjualan = (req, res) => {
  console.log("DATA MASUK:");
  console.log(req.body);

  const {
    id_user,
    id_kategori,
    id_brand,
    id_wilayah,
    nama_produk,
    nama_toko,
    jumlah,
    harga,
    tanggal_penjualan,
  } = req.body;

  const total = jumlah * harga;

  const sql = `
    INSERT INTO penjualan
    (
      id_user,
      id_kategori,
      id_brand,
      id_wilayah,
      nama_produk,
      nama_toko,
      jumlah,
      harga,
      total,
      tanggal_penjualan
    )

    VALUES (?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      id_user,
      id_kategori,
      id_brand,
      id_wilayah,
      nama_produk,
      nama_toko,
      jumlah,
      harga,
      total,
      tanggal_penjualan,
    ],

    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Data penjualan berhasil ditambahkan",
        id_penjualan: result.insertId,
      });
    },
  );
};

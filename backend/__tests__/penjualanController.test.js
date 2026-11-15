import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

import db from "../config/db.js";
import {
  getPenjualan,
  tambahPenjualan,
} from "../controllers/penjualanController.js";

const createResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const createRequest = (body = {}) => ({ body });

const mockQuery = (error, result) => {
  db.query.mockImplementation((sql, params, callback) => {
    if (typeof params === "function") {
      callback = params;
    }
    callback(error, result);
  });
};

describe("Backend Penjualan Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  // GET SEMUA PENJUALAN

  it("1. Berhasil mengambil semua data penjualan", () => {
    const res = createResponse();
    const data = [
      {
        id_penjualan: 1,
        nama_produk: "Serum",
        nama_toko: "Toko A",
        jumlah: 2,
        harga: 75000,
        total: 150000,
      },
    ];

    mockQuery(null, data);

    getPenjualan({}, res);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("FROM penjualan p"),
      expect.any(Function),
    );

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data,
    });
  });

  it("2. Gagal mengambil data jika database error", () => {
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getPenjualan({}, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Database error",
      }),
    );
  });

  // TAMBAH PENJUALAN

  it("3. Gagal menambahkan penjualan jika query user error", () => {
    const req = createRequest({
      id_user: 1,
      id_kategori: 1,
      id_brand: 1,
      nama_produk: "Serum",
      nama_toko: "Toko A",
      jumlah: 2,
      harga: 75000,
      tanggal_penjualan: "2026-10-20",
    });
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    tambahPenjualan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Database error",
      }),
    );
  });

  it("4. Gagal menambahkan penjualan jika user tidak ditemukan", () => {
    const req = createRequest({
      id_user: 99,
      id_kategori: 1,
      id_brand: 1,
      nama_produk: "Serum",
      nama_toko: "Toko A",
      jumlah: 2,
      harga: 75000,
      tanggal_penjualan: "2026-10-20",
    });
    const res = createResponse();

    mockQuery(null, []);

    tambahPenjualan(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User tidak ditemukan",
    });
  });

  it("5. Berhasil menambahkan penjualan dan menghitung total", () => {
    const req = createRequest({
      id_user: 1,
      id_kategori: 2,
      id_brand: 3,
      nama_produk: "Serum",
      nama_toko: "Toko A",
      jumlah: 2,
      harga: 75000,
      tanggal_penjualan: "2026-10-20",
    });
    const res = createResponse();

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ id_wilayah: 4 }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 15 });
      });

    tambahPenjualan(req, res);

    expect(db.query).toHaveBeenCalledTimes(2);

    expect(db.query.mock.calls[1][1]).toEqual([
      1,
      2,
      3,
      4,
      "Serum",
      "Toko A",
      2,
      75000,
      150000,
      "2026-10-20",
    ]);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Data penjualan berhasil ditambahkan",
      id_penjualan: 15,
    });
  });

  it("6. Gagal menyimpan penjualan jika query INSERT error", () => {
    const req = createRequest({
      id_user: 1,
      id_kategori: 2,
      id_brand: 3,
      nama_produk: "Serum",
      nama_toko: "Toko A",
      jumlah: 2,
      harga: 75000,
      tanggal_penjualan: "2026-10-20",
    });
    const res = createResponse();

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ id_wilayah: 4 }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(new Error("Insert gagal"), null);
      });

    tambahPenjualan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Insert gagal",
    });
  });

  it("7. Menggunakan wilayah milik user saat menyimpan penjualan", () => {
    const req = createRequest({
      id_user: 5,
      id_kategori: 1,
      id_brand: 2,
      nama_produk: "Toner",
      nama_toko: "Toko B",
      jumlah: 3,
      harga: 20000,
      tanggal_penjualan: "2026-10-21",
    });
    const res = createResponse();

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ id_wilayah: 7 }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 20 });
      });

    tambahPenjualan(req, res);

    expect(db.query.mock.calls[1][1][3]).toBe(7);
  });

  it("8. Total penjualan dihitung dari jumlah dikali harga", () => {
    const req = createRequest({
      id_user: 1,
      id_kategori: 1,
      id_brand: 1,
      nama_produk: "Cleanser",
      nama_toko: "Toko C",
      jumlah: 4,
      harga: 25000,
      tanggal_penjualan: "2026-10-22",
    });
    const res = createResponse();

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ id_wilayah: 2 }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 21 });
      });

    tambahPenjualan(req, res);

    expect(db.query.mock.calls[1][1][8]).toBe(100000);
  });

  it("9. Query GET mengambil data dengan urutan tanggal terbaru", () => {
    const res = createResponse();

    mockQuery(null, []);

    getPenjualan({}, res);

    expect(db.query.mock.calls[0][0]).toContain(
      "ORDER BY p.tanggal_penjualan DESC",
    );
  });

  it("10. Query INSERT menggunakan parameter agar nilai input tidak digabung ke SQL", () => {
    const req = createRequest({
      id_user: 1,
      id_kategori: 1,
      id_brand: 1,
      nama_produk: "Serum",
      nama_toko: "Toko A",
      jumlah: 1,
      harga: 50000,
      tanggal_penjualan: "2026-10-20",
    });
    const res = createResponse();

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ id_wilayah: 1 }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 22 });
      });

    tambahPenjualan(req, res);

    expect(db.query.mock.calls[1][0]).toContain("VALUES (?,?,?,?,?,?,?,?,?,?)");
    expect(db.query.mock.calls[1][0]).not.toContain("Serum");
  });
});

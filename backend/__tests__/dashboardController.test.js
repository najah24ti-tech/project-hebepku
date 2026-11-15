import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

import db from "../config/db.js";
import {
  getDashboardOwner,
  getChartPenjualan,
  getDetailPenjualanDashboard,
  getPenjualanBrand,
  getPenjualanWilayah,
  getDashboardSummary,
  getDashboardChart,
} from "../controllers/dashboardController.js";

const createResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const createRequest = ({ query = {} } = {}) => ({ query });

const mockQuery = (error, result) => {
  db.query.mockImplementation((sql, params, callback) => {
    if (typeof params === "function") {
      callback = params;
    }
    callback(error, result);
  });
};

describe("Backend Dashboard Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. DASHBOARD OWNER

  it("1. Dashboard gagal jika query user mengalami error", () => {
    const req = createRequest({ query: { id_user: 1 } });
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getDashboardOwner(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database error",
    });
  });

  it("2. Dashboard gagal jika user tidak ditemukan", () => {
    const req = createRequest({ query: { id_user: 99 } });
    const res = createResponse();

    mockQuery(null, []);

    getDashboardOwner(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User tidak ditemukan",
    });
  });

  it("3. Dashboard owner berhasil mengambil semua penjualan", () => {
    const req = createRequest({ query: { id_user: 1 } });
    const res = createResponse();

    const penjualan = [
      { id_penjualan: 1, nama_produk: "Serum", total: 150000 },
    ];

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ role: "owner", id_wilayah: null }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, penjualan);
      });

    getDashboardOwner(req, res);

    expect(db.query).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: penjualan,
    });
  });

  it("4. Dashboard leader membatasi data berdasarkan wilayah", () => {
    const req = createRequest({ query: { id_user: 2 } });
    const res = createResponse();

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ role: "leader", id_wilayah: 3 }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, []);
      });

    getDashboardOwner(req, res);

    expect(db.query).toHaveBeenCalledTimes(2);

    const secondCall = db.query.mock.calls[1];

    expect(secondCall[0]).toContain("WHERE p.id_wilayah = ?");
    expect(secondCall[1]).toEqual([3]);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
    });
  });

  it("5. Dashboard gagal jika query data penjualan error", () => {
    const req = createRequest({ query: { id_user: 1 } });
    const res = createResponse();

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ role: "owner", id_wilayah: null }]);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(new Error("Penjualan error"), null);
      });

    getDashboardOwner(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Penjualan error",
    });
  });

  // 2. GRAFIK PENJUALAN BULANAN

  it("6. Grafik penjualan bulanan berhasil mengambil data", () => {
    const res = createResponse();
    const data = [{ bulan: "2026-10", total_penjualan: 400000 }];

    mockQuery(null, data);

    getChartPenjualan({}, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data,
    });
  });

  it("7. Grafik penjualan bulanan menangani database error", () => {
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getChartPenjualan({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 3. DETAIL PENJUALAN

  it("8. Detail penjualan berhasil mengambil data", () => {
    const res = createResponse();
    const data = [{ id_penjualan: 1, nama_produk: "Serum" }];

    mockQuery(null, data);

    getDetailPenjualanDashboard({}, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data,
    });
  });

  it("9. Detail penjualan menangani database error", () => {
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getDetailPenjualanDashboard({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 4. PENJUALAN BERDASARKAN BRAND

  it("10. Penjualan berdasarkan brand berhasil mengambil data", () => {
    const res = createResponse();
    const data = [{ nama_brand: "Wardah", total: 200000 }];

    mockQuery(null, data);

    getPenjualanBrand({}, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data,
    });
  });

  it("11. Penjualan berdasarkan brand menangani database error", () => {
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getPenjualanBrand({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 5. PENJUALAN BERDASARKAN WILAYAH

  it("12. Penjualan berdasarkan wilayah berhasil mengambil data", () => {
    const res = createResponse();
    const data = [{ nama_wilayah: "Pekanbaru", total: 300000 }];

    mockQuery(null, data);

    getPenjualanWilayah({}, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data,
    });
  });

  it("13. Penjualan berdasarkan wilayah menangani database error", () => {
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getPenjualanWilayah({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 6. RINGKASAN DASHBOARD

  it("14. Ringkasan dashboard berhasil mengambil total transaksi", () => {
    const res = createResponse();
    const summary = {
      total_transaksi: 10,
      total_produk: 25,
      total_penjualan: 1500000,
    };

    mockQuery(null, [summary]);

    getDashboardSummary({}, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      summary,
    });
  });

  it("15. Ringkasan dashboard menangani database error", () => {
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getDashboardSummary({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 7. GRAFIK DASHBOARD

  it("16. Grafik dashboard berhasil mengambil data bulanan", () => {
    const res = createResponse();
    const data = [{ bulan: "2026-10", total_penjualan: 500000 }];

    mockQuery(null, data);

    getDashboardChart({}, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data,
    });
  });

  it("17. Grafik dashboard menangani database error", () => {
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getDashboardChart({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

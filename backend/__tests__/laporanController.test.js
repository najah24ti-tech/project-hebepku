import { describe, it, expect, vi, beforeEach } from "vitest";

const { queryMock, workbookMock, worksheetMock, writeMock } = vi.hoisted(
  () => ({
    queryMock: vi.fn(),
    workbookMock: vi.fn(),
    worksheetMock: {
      columns: [],
      addRow: vi.fn(),
    },
    writeMock: vi.fn(),
  }),
);

vi.mock("../config/db.js", () => ({
  default: {
    query: queryMock,
  },
}));

vi.mock("exceljs", () => ({
  default: {
    Workbook: workbookMock,
  },
}));

import {
  getLaporan,
  getBulanan,
  getBrand,
  getKategori,
  exportExcel,
} from "../controllers/laporanController.js";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    end: vi.fn(),
  };
}

describe("Laporan Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    worksheetMock.columns = [];
    worksheetMock.addRow.mockClear();

    writeMock.mockReset();
    writeMock.mockResolvedValue(undefined);

    workbookMock.mockImplementation(function () {
      return {
        addWorksheet: vi.fn(() => worksheetMock),
        xlsx: {
          write: writeMock,
        },
      };
    });
  });

  // =========================
  // LAPORAN HARIAN
  // =========================
  describe("getLaporan", () => {
    it("berhasil mengambil laporan tanpa filter tanggal", () => {
      const data = [
        {
          tanggal_penjualan: "2026-10-01",
          total_penjualan: 150000,
          total_produk: 3,
        },
      ];

      queryMock.mockImplementation((sql, params, callback) => {
        callback(null, data);
      });

      const req = { query: {} };
      const res = mockResponse();

      getLaporan(req, res);

      expect(queryMock).toHaveBeenCalledOnce();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("berhasil mengambil laporan dengan filter tanggal", () => {
      const data = [{ total_penjualan: 250000 }];

      queryMock.mockImplementation((sql, params, callback) => {
        expect(sql).toContain("BETWEEN ? AND ?");
        expect(params).toEqual(["2026-10-01", "2026-10-31"]);

        callback(null, data);
      });

      const req = {
        query: {
          awal: "2026-10-01",
          akhir: "2026-10-31",
        },
      };

      const res = mockResponse();

      getLaporan(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("mengembalikan status 500 saat database error", () => {
      queryMock.mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"), null);
      });

      const res = mockResponse();

      getLaporan({ query: {} }, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });

  // =========================
  // GRAFIK BULANAN
  // =========================
  describe("getBulanan", () => {
    it("berhasil mengambil data grafik bulanan", () => {
      const data = [
        { bulan: "2026-09", total: 500000 },
        { bulan: "2026-10", total: 750000 },
      ];

      queryMock.mockImplementation((sql, callback) => {
        callback(null, data);
      });

      const res = mockResponse();

      getBulanan({}, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("mengembalikan status 500 saat database error", () => {
      queryMock.mockImplementation((sql, callback) => {
        callback(new Error("Gagal mengambil data bulanan"), null);
      });

      const res = mockResponse();

      getBulanan({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Gagal mengambil data bulanan",
      });
    });
  });

  // =========================
  // GRAFIK BRAND
  // =========================
  describe("getBrand", () => {
    it("berhasil mengambil total penjualan per brand", () => {
      const data = [
        { nama_brand: "Brand A", total: 300000 },
        { nama_brand: "Brand B", total: 450000 },
      ];

      queryMock.mockImplementation((sql, callback) => {
        callback(null, data);
      });

      const res = mockResponse();

      getBrand({}, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("mengembalikan status 500 saat database error", () => {
      queryMock.mockImplementation((sql, callback) => {
        callback(new Error("Gagal mengambil data brand"), null);
      });

      const res = mockResponse();

      getBrand({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Gagal mengambil data brand",
      });
    });
  });

  // =========================
  // GRAFIK KATEGORI
  // =========================
  describe("getKategori", () => {
    it("berhasil mengambil total penjualan per kategori", () => {
      const data = [
        { nama_kategori: "Skincare", total: 600000 },
        { nama_kategori: "Makeup", total: 200000 },
      ];

      queryMock.mockImplementation((sql, callback) => {
        callback(null, data);
      });

      const res = mockResponse();

      getKategori({}, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("mengembalikan status 500 saat database error", () => {
      queryMock.mockImplementation((sql, callback) => {
        callback(new Error("Gagal mengambil data kategori"), null);
      });

      const res = mockResponse();

      getKategori({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Gagal mengambil data kategori",
      });
    });
  });

  // =========================
  // EXPORT EXCEL
  // =========================
  describe("exportExcel", () => {
    it("berhasil mengekspor laporan ke Excel", async () => {
      const data = [
        {
          tanggal_penjualan: "2026-10-01",
          nama_brand: "Brand A",
          nama_kategori: "Skincare",
          nama_produk: "Serum",
          nama_toko: "Toko A",
          jumlah: 2,
          harga: 75000,
          total: 150000,
        },
      ];

      queryMock.mockImplementation((sql, callback) => {
        callback(null, data);
      });

      const req = {};
      const res = mockResponse();

      exportExcel(req, res);

      // Tunggu proses callback async ekspor selesai.
      await vi.waitFor(() => {
        expect(writeMock).toHaveBeenCalledWith(res);
      });

      expect(workbookMock).toHaveBeenCalledOnce();
      expect(worksheetMock.addRow).toHaveBeenCalledWith(data[0]);

      expect(worksheetMock.columns).toEqual([
        { header: "Tanggal", key: "tanggal_penjualan", width: 18 },
        { header: "Brand", key: "nama_brand", width: 20 },
        { header: "Kategori", key: "nama_kategori", width: 20 },
        { header: "Produk", key: "nama_produk", width: 25 },
        { header: "Nama Toko", key: "nama_toko", width: 20 },
        { header: "Jumlah", key: "jumlah", width: 12 },
        { header: "Harga", key: "harga", width: 15 },
        { header: "Total", key: "total", width: 18 },
      ]);

      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        "attachment; filename=Laporan_Penjualan.xlsx",
      );

      expect(res.end).toHaveBeenCalledOnce();
    });

    it("mengembalikan status 500 saat database gagal mengekspor", () => {
      queryMock.mockImplementation((sql, callback) => {
        callback(new Error("Gagal ekspor laporan"), null);
      });

      const res = mockResponse();

      exportExcel({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Gagal ekspor laporan",
      });

      expect(workbookMock).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

const { queryMock } = vi.hoisted(() => ({
  queryMock: vi.fn(),
}));

vi.mock("../config/db.js", () => ({
  default: {
    query: queryMock,
  },
}));

import { getKategori } from "../controllers/kategoriController.js";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe("Kategori Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getKategori", () => {
    it("berhasil mengambil seluruh data kategori", () => {
      const data = [
        {
          id_kategori: 1,
          nama_kategori: "Skincare",
        },
        {
          id_kategori: 2,
          nama_kategori: "Makeup",
        },
      ];

      queryMock.mockImplementation((sql, callback) => {
        expect(sql).toBe("SELECT * FROM kategori");
        callback(null, data);
      });

      const req = {};
      const res = mockResponse();

      getKategori(req, res);

      expect(queryMock).toHaveBeenCalledOnce();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it("mengembalikan status 500 jika database mengalami error", () => {
      queryMock.mockImplementation((sql, callback) => {
        callback(new Error("Database error"), null);
      });

      const req = {};
      const res = mockResponse();

      getKategori(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });
});

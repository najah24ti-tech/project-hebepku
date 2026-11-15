import { describe, it, expect, vi, beforeEach } from "vitest";

const { queryMock } = vi.hoisted(() => ({
  queryMock: vi.fn(),
}));

vi.mock("../config/db.js", () => ({
  default: {
    query: queryMock,
  },
}));

import { getBrands } from "../controllers/brandController.js";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe("Brand Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBrands", () => {
    it("berhasil mengambil seluruh data brand", () => {
      const data = [
        {
          id_brand: 1,
          nama_brand: "Wardah",
        },
        {
          id_brand: 2,
          nama_brand: "Somethinc",
        },
      ];

      queryMock.mockImplementation((sql, callback) => {
        expect(sql).toBe("SELECT * FROM brand");
        callback(null, data);
      });

      const req = {};
      const res = mockResponse();

      getBrands(req, res);

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

      getBrands(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });
});

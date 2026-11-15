import { describe, it, expect, vi, beforeEach } from "vitest";

const { queryMock } = vi.hoisted(() => ({
  queryMock: vi.fn(),
}));

vi.mock("../config/db.js", () => ({
  default: {
    query: queryMock,
  },
}));

import { getWilayah } from "../controllers/wilayahController.js";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe("Wilayah Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWilayah", () => {
    it("berhasil mengambil seluruh data wilayah", () => {
      const data = [
        {
          id_wilayah: 1,
          nama_wilayah: "Pekanbaru",
        },
        {
          id_wilayah: 2,
          nama_wilayah: "Batam",
        },
      ];

      queryMock.mockImplementation((sql, callback) => {
        expect(sql).toBe("SELECT * FROM wilayah");
        callback(null, data);
      });

      const req = {};
      const res = mockResponse();

      getWilayah(req, res);

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

      getWilayah(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });
});

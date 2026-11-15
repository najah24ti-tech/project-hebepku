import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

import db from "../config/db.js";
import bcrypt from "bcrypt";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const createResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const createRequest = ({ body = {}, params = {} } = {}) => ({
  body,
  params,
});

describe("Backend User Controller - Kelola Akun", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  // GET ALL USER

  it("1. Berhasil mengambil semua data user", () => {
    const res = createResponse();
    const data = [
      {
        id_user: 1,
        nama: "Admin",
        email: "admin@test.com",
        role: "owner",
      },
    ];

    db.query.mockImplementation((sql, callback) => {
      callback(null, data);
    });

    getUsers({}, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data,
    });
  });

  it("2. Gagal mengambil user jika database error", () => {
    const res = createResponse();

    db.query.mockImplementation((sql, callback) => {
      callback(new Error("Database error"), null);
    });

    getUsers({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database error",
    });
  });

  // CREATE USER

  it("3. Gagal membuat user jika pemeriksaan email error", async () => {
    const req = createRequest({
      body: {
        nama: "Pengguna",
        email: "user@test.com",
        password: "password123",
        role: "ba",
        id_wilayah: 1,
        is_active: 1,
      },
    });
    const res = createResponse();

    db.query.mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), null);
    });

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database error",
    });
  });

  it("4. Gagal membuat user jika email sudah digunakan", async () => {
    const req = createRequest({
      body: {
        nama: "Pengguna",
        email: "user@test.com",
        password: "password123",
        role: "ba",
        id_wilayah: 1,
        is_active: 1,
      },
    });
    const res = createResponse();

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, [{ id_user: 1 }]);
    });

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email sudah digunakan",
    });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it("5. Berhasil membuat user dengan password yang di-hash", async () => {
    const req = createRequest({
      body: {
        nama: "Pengguna Baru",
        email: "baru@test.com",
        password: "password123",
        role: "ba",
        id_wilayah: 2,
        is_active: 1,
      },
    });
    const res = createResponse();

    bcrypt.hash.mockResolvedValue("hash-password");

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, []);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 2 });
      });

    await createUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(db.query).toHaveBeenCalledTimes(2);
    expect(db.query.mock.calls[1][1]).toEqual([
      "Pengguna Baru",
      "baru@test.com",
      "hash-password",
      "ba",
      2,
      1,
    ]);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User berhasil ditambahkan",
    });
  });

  it("6. Gagal menyimpan user jika query INSERT error", async () => {
    const req = createRequest({
      body: {
        nama: "Pengguna",
        email: "baru@test.com",
        password: "password123",
        role: "ba",
        id_wilayah: 1,
        is_active: 1,
      },
    });
    const res = createResponse();

    bcrypt.hash.mockResolvedValue("hash-password");

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, []);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(new Error("Insert gagal"), null);
      });

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Insert gagal",
    });
  });

  it("7. User tanpa wilayah disimpan dengan id_wilayah null", async () => {
    const req = createRequest({
      body: {
        nama: "Owner Baru",
        email: "owner@test.com",
        password: "password123",
        role: "owner",
        id_wilayah: "",
        is_active: 1,
      },
    });
    const res = createResponse();

    bcrypt.hash.mockResolvedValue("hash-password");

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, []);
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 3 });
      });

    await createUser(req, res);

    expect(db.query.mock.calls[1][1][4]).toBeNull();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User berhasil ditambahkan",
    });
  });

  // UPDATE USER

  it("8. Berhasil memperbarui data user", () => {
    const req = createRequest({
      params: { id: "2" },
      body: {
        nama: "Nama Update",
        email: "update@test.com",
        role: "leader",
        id_wilayah: 3,
        is_active: 1,
      },
    });
    const res = createResponse();

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    updateUser(req, res);

    expect(db.query.mock.calls[0][1]).toEqual([
      "Nama Update",
      "update@test.com",
      "leader",
      3,
      1,
      "2",
    ]);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User berhasil diupdate",
    });
  });

  it("9. Update user gagal jika database error", () => {
    const req = createRequest({
      params: { id: "2" },
      body: {
        nama: "Nama Update",
        email: "update@test.com",
        role: "leader",
        id_wilayah: 3,
        is_active: 1,
      },
    });
    const res = createResponse();

    db.query.mockImplementation((sql, params, callback) => {
      callback(new Error("Update gagal"));
    });

    updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Update gagal",
    });
  });

  it("10. Update user tanpa wilayah menggunakan null", () => {
    const req = createRequest({
      params: { id: "1" },
      body: {
        nama: "Owner",
        email: "owner@test.com",
        role: "owner",
        id_wilayah: "",
        is_active: 1,
      },
    });
    const res = createResponse();

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    updateUser(req, res);

    expect(db.query.mock.calls[0][1][3]).toBeNull();
  });

  // DELETE USER

  it("11. Berhasil menghapus user", () => {
    const req = createRequest({
      params: { id: "3" },
    });
    const res = createResponse();

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    deleteUser(req, res);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM user"),
      ["3"],
      expect.any(Function),
    );

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User berhasil dihapus",
    });
  });

  it("12. Delete user gagal jika database error", () => {
    const req = createRequest({
      params: { id: "3" },
    });
    const res = createResponse();

    db.query.mockImplementation((sql, params, callback) => {
      callback(new Error("Delete gagal"));
    });

    deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Delete gagal",
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

import db from "../config/db.js";
import bcrypt from "bcrypt";
import {
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

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

const mockQuery = (error, result) => {
  db.query.mockImplementation((sql, values, callback) => {
    callback(error, result);
  });
};

describe("Backend Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  // =========================
  // LOGIN
  // =========================

  it("1. Login gagal jika email kosong", () => {
    const req = createRequest({
      body: { password: "rahasia" },
    });
    const res = createResponse();

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email dan password wajib diisi",
    });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("2. Login gagal jika password kosong", () => {
    const req = createRequest({
      body: { email: "user@test.com" },
    });
    const res = createResponse();

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(db.query).not.toHaveBeenCalled();
  });

  it("3. Login gagal jika database error", () => {
    const req = createRequest({
      body: { email: "user@test.com", password: "123456" },
    });
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database error",
    });
  });

  it("4. Login gagal jika email tidak ditemukan", () => {
    const req = createRequest({
      body: { email: "tidakada@test.com", password: "123456" },
    });
    const res = createResponse();

    mockQuery(null, []);

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email tidak ditemukan",
    });
  });

  it("5. Login gagal jika akun tidak aktif", () => {
    const req = createRequest({
      body: { email: "user@test.com", password: "123456" },
    });
    const res = createResponse();

    mockQuery(null, [{ email: "user@test.com", is_active: 0 }]);

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Akun tidak aktif",
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("6. Login gagal jika password salah", async () => {
    const req = createRequest({
      body: { email: "user@test.com", password: "salah" },
    });
    const res = createResponse();

    mockQuery(null, [
      {
        id_user: 1,
        email: "user@test.com",
        password: "hash-password",
        is_active: 1,
      },
    ]);

    bcrypt.compare.mockResolvedValue(false);

    login(req, res);
    await vi.waitFor(() => {
      expect(res.status).toHaveBeenCalledWith(401);
    });

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Password salah",
    });
  });

  it("7. Login berhasil dan password tidak dikirim ke frontend", async () => {
    const req = createRequest({
      body: { email: "user@test.com", password: "benar" },
    });
    const res = createResponse();

    mockQuery(null, [
      {
        id_user: 1,
        nama: "Pengguna",
        email: "user@test.com",
        password: "hash-password",
        role: "owner",
        id_wilayah: null,
        is_active: 1,
      },
    ]);

    bcrypt.compare.mockResolvedValue(true);

    login(req, res);

    await vi.waitFor(() => {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    const response = res.json.mock.calls[0][0];

    expect(response.success).toBe(true);
    expect(response.message).toBe("Login berhasil");
    expect(response.user.email).toBe("user@test.com");
    expect(response.user).not.toHaveProperty("password");
  });

  // =========================
  // GET PROFILE
  // =========================

  it("8. Get Profile berhasil jika user ditemukan", () => {
    const req = createRequest({ params: { id: "1" } });
    const res = createResponse();

    const user = {
      id_user: 1,
      nama: "Pengguna",
      email: "user@test.com",
      role: "owner",
    };

    mockQuery(null, [user]);

    getProfile(req, res);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id_user = ?"),
      ["1"],
      expect.any(Function),
    );
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user,
    });
  });

  it("9. Get Profile gagal jika user tidak ditemukan", () => {
    const req = createRequest({ params: { id: "999" } });
    const res = createResponse();

    mockQuery(null, []);

    getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User tidak ditemukan",
    });
  });

  it("10. Get Profile gagal jika database error", () => {
    const req = createRequest({ params: { id: "1" } });
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database error",
    });
  });

  // =========================
  // UPDATE PROFILE
  // =========================

  it("11. Update Profile berhasil tanpa mengganti password", () => {
    const req = createRequest({
      params: { id: "1" },
      body: {
        nama: "Nama Baru",
        email: "baru@test.com",
        password: "",
      },
    });
    const res = createResponse();

    mockQuery(null, { affectedRows: 1 });

    updateProfile(req, res);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE user"),
      ["Nama Baru", "baru@test.com", "1"],
      expect.any(Function),
    );

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Profil berhasil diperbarui",
    });
  });

  it("12. Update Profile berhasil dengan password baru yang di-hash", async () => {
    const req = createRequest({
      params: { id: "1" },
      body: {
        nama: "Nama Baru",
        email: "baru@test.com",
        password: "passwordbaru",
      },
    });
    const res = createResponse();

    bcrypt.hash.mockResolvedValue("hash-baru");
    mockQuery(null, { affectedRows: 1 });

    await updateProfile(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("passwordbaru", 10);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("password=?"),
      ["Nama Baru", "baru@test.com", "hash-baru", "1"],
      expect.any(Function),
    );

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Profil berhasil diperbarui",
    });
  });

  it("13. Update Profile gagal jika database error", () => {
    const req = createRequest({
      params: { id: "1" },
      body: {
        nama: "Nama Baru",
        email: "baru@test.com",
        password: "",
      },
    });
    const res = createResponse();

    mockQuery(new Error("Database error"), null);

    updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database error",
    });
  });
});

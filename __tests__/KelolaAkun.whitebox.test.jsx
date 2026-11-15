import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import KelolaAkun from "../src/pages/KelolaAkun.jsx";

const mockUsers = [
  {
    id_user: 1,
    nama: "Widodo",
    email: "widodo@test.com",
    role: "owner",
    id_wilayah: null,
    nama_wilayah: null,
    is_active: 1,
  },
  {
    id_user: 2,
    nama: "Najah",
    email: "najah@test.com",
    role: "leader",
    id_wilayah: 1,
    nama_wilayah: "Pekanbaru",
    is_active: 1,
  },
  {
    id_user: 3,
    nama: "Baydella",
    email: "baydella@test.com",
    role: "ba",
    id_wilayah: 1,
    nama_wilayah: "Pekanbaru",
    is_active: 0,
  },
];

const mockWilayah = [
  { id_wilayah: 1, nama_wilayah: "Pekanbaru" },
  { id_wilayah: 2, nama_wilayah: "Batam" },
];

function mockFetchSuccess() {
  global.fetch = vi.fn((url, options = {}) => {
    if (url.includes("/api/wilayah")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockWilayah,
          }),
      });
    }

    if (url.includes("/api/users") && options.method === "POST") {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            message: "User berhasil ditambahkan",
          }),
      });
    }

    if (url.includes("/api/users/") && options.method === "PUT") {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            message: "User berhasil diperbarui",
          }),
      });
    }

    if (url.includes("/api/users/") && options.method === "DELETE") {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            message: "User berhasil dihapus",
          }),
      });
    }

    if (url.includes("/api/users")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockUsers,
          }),
      });
    }

    return Promise.resolve({
      json: () =>
        Promise.resolve({
          success: false,
          data: [],
        }),
    });
  });
}

function renderKelolaAkun() {
  return render(
    <MemoryRouter>
      <KelolaAkun />
    </MemoryRouter>,
  );
}

describe("White Box Testing - Kelola Akun", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchSuccess();

    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // WB-KA01: Menampilkan halaman Kelola Akun
  it("WB-KA01 - Menampilkan halaman Kelola Akun", async () => {
    renderKelolaAkun();

    expect(await screen.findByText("Kelola Akun")).toBeTruthy();

    expect(
      screen.getByText(
        "Manajemen data pengguna sistem dan pengaturan hak akses.",
      ),
    ).toBeTruthy();
  });

  // WB-KA02: Mengambil data pengguna dan wilayah
  it("WB-KA02 - Memanggil API pengguna dan wilayah", async () => {
    renderKelolaAkun();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/users",
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/wilayah",
      );
    });
  });

  // WB-KA03: Menampilkan statistik role pengguna
  it("WB-KA03 - Menampilkan statistik role pengguna", async () => {
    renderKelolaAkun();

    expect(await screen.findByText("Widodo")).toBeTruthy();

    expect(screen.getAllByText("Leader").length).toBeGreaterThan(0);

    expect(screen.getAllByText("Business Analyst").length).toBeGreaterThan(0);
  });

  // WB-KA04: Menampilkan daftar pengguna
  it("WB-KA04 - Menampilkan data pengguna", async () => {
    renderKelolaAkun();

    expect(await screen.findByText("Widodo")).toBeTruthy();
    expect(screen.getByText("Najah")).toBeTruthy();
    expect(screen.getByText("Baydella")).toBeTruthy();

    // Pekanbaru muncul dua kali karena digunakan oleh dua pengguna.
    expect(screen.getAllByText("Pekanbaru").length).toBe(2);

    expect(screen.getByText("widodo@test.com")).toBeTruthy();
    expect(screen.getByText("najah@test.com")).toBeTruthy();
    expect(screen.getByText("baydella@test.com")).toBeTruthy();
  });

  // WB-KA05: Mencari pengguna berdasarkan nama atau email
  it("WB-KA05 - Memfilter pengguna melalui pencarian", async () => {
    renderKelolaAkun();

    await screen.findByText("Najah");

    const searchInput = screen.getByPlaceholderText("Cari User...");

    fireEvent.change(searchInput, {
      target: { value: "najah" },
    });

    expect(screen.getByText("Najah")).toBeTruthy();
    expect(screen.queryByText("Baydella")).toBeNull();

    fireEvent.change(searchInput, {
      target: { value: "widodo@test.com" },
    });

    expect(screen.getByText("Widodo")).toBeTruthy();
    expect(screen.queryByText("Najah")).toBeNull();
  });

  // WB-KA06: Membuka modal tambah pengguna
  it("WB-KA06 - Membuka form tambah pengguna", async () => {
    renderKelolaAkun();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Tambah User Baru/i,
      }),
    );

    expect(await screen.findByText("Tambah User")).toBeTruthy();

    const namaInput = document.querySelector('input[name="nama"]');

    const emailInput = document.querySelector('input[name="email"]');

    const passwordInput = document.querySelector('input[name="password"]');

    expect(namaInput).not.toBeNull();
    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();

    expect(namaInput.required).toBe(true);
    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });

  // WB-KA07: Menambahkan pengguna baru
  it("WB-KA07 - Mengirim data pengguna baru ke API", async () => {
    renderKelolaAkun();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Tambah User Baru/i,
      }),
    );

    await screen.findByText("Tambah User");

    const namaInput = document.querySelector('input[name="nama"]');

    const emailInput = document.querySelector('input[name="email"]');

    const passwordInput = document.querySelector('input[name="password"]');

    const roleSelect = document.querySelector('select[name="role"]');

    const wilayahSelect = document.querySelector('select[name="id_wilayah"]');

    const statusSelect = document.querySelector('select[name="is_active"]');

    fireEvent.change(namaInput, {
      target: { name: "nama", value: "User Baru" },
    });

    fireEvent.change(emailInput, {
      target: { name: "email", value: "baru@test.com" },
    });

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "password123" },
    });

    if (roleSelect) {
      fireEvent.change(roleSelect, {
        target: { name: "role", value: "ba" },
      });
    }

    if (wilayahSelect) {
      await waitFor(() => {
        expect(wilayahSelect.options.length).toBeGreaterThan(1);
      });

      fireEvent.change(wilayahSelect, {
        target: { name: "id_wilayah", value: "1" },
      });
    }

    if (statusSelect) {
      fireEvent.change(statusSelect, {
        target: { name: "is_active", value: "1" },
      });
    }

    fireEvent.click(
      screen.getByRole("button", {
        name: /^Simpan$/i,
      }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/users",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    });

    const postCall = global.fetch.mock.calls.find(
      ([url, options]) =>
        url === "http://localhost:5000/api/users" && options?.method === "POST",
    );

    expect(postCall).toBeTruthy();

    const body = JSON.parse(postCall[1].body);

    expect(body.nama).toBe("User Baru");
    expect(body.email).toBe("baru@test.com");
    expect(body.password).toBe("password123");
    expect(body.role).toBe("ba");

    expect(window.alert).toHaveBeenCalledWith("User berhasil ditambahkan");
  });

  // WB-KA08: Membuka modal edit pengguna
  it("WB-KA08 - Membuka form edit pengguna", async () => {
    renderKelolaAkun();

    await screen.findByText("Najah");

    fireEvent.click(screen.getAllByTitle("Edit User")[0]);

    expect(await screen.findByText("Edit User")).toBeTruthy();

    expect(document.querySelector('input[name="nama"]')).not.toBeNull();

    expect(document.querySelector('input[name="email"]')).not.toBeNull();
  });

  // WB-KA09: Menghapus pengguna setelah konfirmasi
  it("WB-KA09 - Menghapus pengguna setelah konfirmasi", async () => {
    renderKelolaAkun();

    await screen.findByText("Baydella");

    fireEvent.click(screen.getAllByTitle("Hapus User")[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/users\/\d+$/),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  // WB-KA10: Membatalkan penghapusan pengguna
  it("WB-KA10 - Tidak menghapus jika konfirmasi dibatalkan", async () => {
    window.confirm.mockReturnValue(false);

    renderKelolaAkun();

    await screen.findByText("Baydella");

    fireEvent.click(screen.getAllByTitle("Hapus User")[0]);

    expect(window.confirm).toHaveBeenCalled();

    expect(
      global.fetch.mock.calls.some(
        ([, options]) => options?.method === "DELETE",
      ),
    ).toBe(false);
  });
});

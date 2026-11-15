import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

import DataPenjualan from "../src/pages/DataPenjualan";

const dataDummy = [
  {
    id_penjualan: 1,
    tanggal_penjualan: "2026-10-20",
    nama_produk: "Serum Vitamin C",
    nama_brand: "Wardah",
    nama_wilayah: "Pekanbaru",
    nama_toko: "Toko Mawar",
    jumlah: 2,
    total: 50000,
  },
  {
    id_penjualan: 2,
    tanggal_penjualan: "2026-10-21",
    nama_produk: "Toner Aloe Vera",
    nama_brand: "Skintific",
    nama_wilayah: "Batam",
    nama_toko: "Toko Melati",
    jumlah: 3,
    total: 75000,
  },
];

const buatResponse = (data, success = true) => ({
  ok: true,
  json: async () => ({
    success,
    data,
  }),
});

const renderDataPenjualan = async (role = "owner") => {
  localStorage.setItem("role", role);

  localStorage.setItem(
    "user",
    JSON.stringify({
      id_user: 1,
      nama: "Najah",
      role,
      id_wilayah: 1,
    }),
  );

  let hasilRender;

  await act(async () => {
    hasilRender = render(<DataPenjualan />);

    // Menunggu proses fetch dan response.json() pada useEffect.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  return hasilRender;
};

describe("White Box Testing - Data Penjualan HEBEPKU", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    global.fetch = vi.fn(() => Promise.resolve(buatResponse(dataDummy)));

    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // WB-DP01: Menampilkan halaman
  it("WB-DP01 - menampilkan halaman Data Penjualan", async () => {
    await renderDataPenjualan();

    expect(
      screen.getByRole("heading", {
        name: "Data Penjualan",
      }),
    ).toBeTruthy();
  });

  // WB-DP02: Mengambil data dari API
  it("WB-DP02 - mengambil data penjualan dari API", async () => {
    await renderDataPenjualan();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/dashboard/detail?id_user=1",
    );
  });

  // WB-DP03: Kolom Wilayah untuk owner
  it("WB-DP03 - menampilkan kolom Wilayah untuk owner", async () => {
    await renderDataPenjualan("owner");

    expect(screen.getByText("Wilayah")).toBeTruthy();

    expect(screen.getByText("Kelola seluruh data penjualan.")).toBeTruthy();
  });

  // WB-DP04: Deskripsi untuk leader
  it("WB-DP04 - menampilkan deskripsi untuk leader", async () => {
    await renderDataPenjualan("leader");

    expect(
      screen.getByText("Melihat data penjualan untuk analisis."),
    ).toBeTruthy();

    expect(screen.getByText("Wilayah")).toBeTruthy();
  });

  // WB-DP05: Kolom Wilayah disembunyikan untuk BA
  it("WB-DP05 - menyembunyikan kolom Wilayah untuk BA", async () => {
    await renderDataPenjualan("ba");

    expect(
      screen.getByText("Melihat data penjualan yang telah diinput."),
    ).toBeTruthy();

    expect(screen.queryByText("Wilayah")).toBeNull();
    expect(screen.getByText("Toko Mawar")).toBeTruthy();
  });

  // WB-DP06: Pencarian produk
  it("WB-DP06 - mencari data berdasarkan nama produk", async () => {
    await renderDataPenjualan();

    fireEvent.change(screen.getByPlaceholderText("Cari produk..."), {
      target: { value: "Serum" },
    });

    expect(screen.getByText("Serum Vitamin C")).toBeTruthy();
    expect(screen.queryByText("Toner Aloe Vera")).toBeNull();
  });

  // WB-DP07: Pencarian berdasarkan toko dan brand
  it("WB-DP07 - mencari data berdasarkan nama toko dan brand", async () => {
    await renderDataPenjualan();

    const kolomCari = screen.getByPlaceholderText("Cari produk...");

    fireEvent.change(kolomCari, {
      target: { value: "Mawar" },
    });

    expect(screen.getByText("Serum Vitamin C")).toBeTruthy();
    expect(screen.queryByText("Toner Aloe Vera")).toBeNull();

    fireEvent.change(kolomCari, {
      target: { value: "Skintific" },
    });

    expect(screen.getByText("Toner Aloe Vera")).toBeTruthy();
    expect(screen.queryByText("Serum Vitamin C")).toBeNull();
  });

  // WB-DP08: Loading
  it("WB-DP08 - menampilkan Loading ketika data sedang dimuat", async () => {
    global.fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(buatResponse(dataDummy));
          }, 50);
        }),
    );

    localStorage.setItem("role", "owner");

    localStorage.setItem(
      "user",
      JSON.stringify({
        id_user: 1,
        role: "owner",
      }),
    );

    render(<DataPenjualan />);

    expect(screen.getByText("Loading...")).toBeTruthy();

    expect(await screen.findByText("Serum Vitamin C")).toBeTruthy();
  });

  // WB-DP09: Data kosong
  it("WB-DP09 - menampilkan pesan ketika data kosong", async () => {
    // Pastikan API mengembalikan array kosong untuk test ini.
    global.fetch = vi.fn(() => Promise.resolve(buatResponse([])));

    await renderDataPenjualan("owner");

    expect(screen.getByText("Tidak ada data")).toBeTruthy();
  });

  // WB-DP10: Format tanggal, jumlah, dan Rupiah
  it("WB-DP10 - menampilkan tanggal, jumlah, dan total dengan format benar", async () => {
    await renderDataPenjualan();

    expect(screen.getByText("Serum Vitamin C")).toBeTruthy();
    expect(screen.getByText("2 pcs")).toBeTruthy();
    expect(screen.getByText("Rp 50.000")).toBeTruthy();

    expect(screen.getByText("Toner Aloe Vera")).toBeTruthy();
    expect(screen.getByText("3 pcs")).toBeTruthy();
    expect(screen.getByText("Rp 75.000")).toBeTruthy();

    expect(screen.getByText("20 Oktober 2026")).toBeTruthy();
  });
});

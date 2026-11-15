import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from "@testing-library/react";

import InputPenjualan from "../src/pages/InputPenjualan";

// Data pengujian
const dataBrand = [
  { id_brand: 1, nama_brand: "Brand Alpha" },
  { id_brand: 2, nama_brand: "Brand Beta" },
];

const dataKategori = [
  { id_kategori: 1, nama_kategori: "Elektronik" },
  { id_kategori: 2, nama_kategori: "Peralatan Rumah" },
];

// Helper response API
const buatResponse = (data) => ({
  ok: true,
  status: 200,
  json: async () => data,
});

// Helper mengatur respons API
const aturFetch = () => {
  global.fetch = vi.fn(async (url, options = {}) => {
    const alamat = String(url);

    if (alamat.includes("/api/brand")) {
      return buatResponse({
        success: true,
        data: dataBrand,
      });
    }

    if (alamat.includes("/api/kategori")) {
      return buatResponse({
        success: true,
        data: dataKategori,
      });
    }

    if (
      alamat.includes("/api/penjualan") &&
      options.method === "POST"
    ) {
      return buatResponse({
        success: true,
        message: "Data penjualan berhasil disimpan",
      });
    }

    return buatResponse({
      success: false,
      message: "Endpoint tidak ditemukan",
      data: [],
    });
  });
};

// Helper mengambil input berdasarkan teks label.
// Komponen asli tidak menggunakan htmlFor dan id.
const getField = (label) => {
  const labels = screen.getAllByText(label, {
    selector: "label",
    exact: true,
  });

  const control = labels[0].parentElement.querySelector(
    "input, select, textarea"
  );

  if (!control) {
    throw new Error(`Input untuk label "${label}" tidak ditemukan`);
  }

  return control;
};

// Helper mengisi formulir
const isiForm = () => {
  fireEvent.change(getField("Brand"), {
    target: { name: "id_brand", value: "1" },
  });

  fireEvent.change(getField("Kategori"), {
    target: { name: "id_kategori", value: "1" },
  });

  fireEvent.change(getField("Nama Produk"), {
    target: {
      name: "nama_produk",
      value: "Produk Pengujian",
    },
  });

  fireEvent.change(getField("Nama Toko"), {
    target: {
      name: "nama_toko",
      value: "Toko Pengujian",
    },
  });

  fireEvent.change(getField("Jumlah"), {
    target: { name: "jumlah", value: "3" },
  });

  fireEvent.change(getField("Harga Satuan"), {
    target: { name: "harga", value: "50000" },
  });

  fireEvent.change(getField("Tanggal Penjualan"), {
    target: {
      name: "tanggal_penjualan",
      value: "2026-10-25",
    },
  });
};

describe("White Box Testing - Input Penjualan HEBEPKU", () => {
  beforeEach(() => {
    localStorage.clear();

    localStorage.setItem(
      "user",
      JSON.stringify({
        id_user: 10,
      })
    );

    vi.clearAllMocks();

    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});

    aturFetch();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // WB-IP01: Menampilkan halaman
  it("WB-IP01: menampilkan halaman Input Penjualan", () => {
    render(<InputPenjualan />);

    expect(
      screen.getByRole("heading", {
        name: "Input Penjualan",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Simpan Data Penjualan",
      })
    ).toBeInTheDocument();
  });

  // WB-IP02: Memuat data Brand
  it("WB-IP02: mengambil dan menampilkan data Brand", async () => {
    render(<InputPenjualan />);

    expect(
      await screen.findByRole("option", {
        name: "Brand Alpha",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Brand Beta",
      })
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/brand"
    );
  });

  // WB-IP03: Memuat data Kategori
  it("WB-IP03: mengambil dan menampilkan data Kategori", async () => {
    render(<InputPenjualan />);

    expect(
      await screen.findByRole("option", {
        name: "Elektronik",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Peralatan Rumah",
      })
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/kategori"
    );
  });

  // WB-IP04: Menghitung total penjualan
  it("WB-IP04: menghitung total berdasarkan jumlah dan harga", () => {
    render(<InputPenjualan />);

    fireEvent.change(getField("Jumlah"), {
      target: { name: "jumlah", value: "3" },
    });

    fireEvent.change(getField("Harga Satuan"), {
      target: { name: "harga", value: "50000" },
    });

    expect(getField("Total Penjualan")).toHaveValue("150.000");
  });

  // WB-IP05: Menghitung ulang ketika jumlah berubah
  it("WB-IP05: menghitung ulang total saat jumlah berubah", () => {
    render(<InputPenjualan />);

    fireEvent.change(getField("Harga Satuan"), {
      target: { name: "harga", value: "20000" },
    });

    fireEvent.change(getField("Jumlah"), {
      target: { name: "jumlah", value: "4" },
    });

    expect(getField("Total Penjualan")).toHaveValue("80.000");
  });

  // WB-IP06: Mengirim data ke API
  it("WB-IP06: mengirim data penjualan melalui POST", async () => {
    render(<InputPenjualan />);

    await screen.findByRole("option", {
      name: "Brand Alpha",
    });

    isiForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan Data Penjualan",
      })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/penjualan",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    const panggilanPost = global.fetch.mock.calls.find(
      ([url, options]) =>
        String(url).includes("/api/penjualan") &&
        options.method === "POST"
    );

    expect(panggilanPost).toBeDefined();

    const dataTerkirim = JSON.parse(
      panggilanPost[1].body
    );

    expect(dataTerkirim).toMatchObject({
      id_brand: "1",
      id_kategori: "1",
      id_user: 10,
      nama_produk: "Produk Pengujian",
      nama_toko: "Toko Pengujian",
      jumlah: "3",
      harga: "50000",
      tanggal_penjualan: "2026-10-25",
      total: 150000,
    });
  });

  // WB-IP07: Menampilkan pesan sukses
  it("WB-IP07: menampilkan pesan ketika penyimpanan berhasil", async () => {
    render(<InputPenjualan />);

    await screen.findByRole("option", {
      name: "Brand Alpha",
    });

    isiForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan Data Penjualan",
      })
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Data penjualan berhasil disimpan"
      );
    });
  });

  // WB-IP08: Mengosongkan formulir setelah penyimpanan berhasil
  it("WB-IP08: mengosongkan formulir setelah penyimpanan berhasil", async () => {
    render(<InputPenjualan />);

    await screen.findByRole("option", {
      name: "Brand Alpha",
    });

    isiForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan Data Penjualan",
      })
    );

    await waitFor(() => {
      expect(getField("Nama Produk")).toHaveValue("");
    });

    expect(getField("Nama Toko")).toHaveValue("");
    expect(getField("Jumlah")).toHaveValue(null);
    expect(getField("Harga Satuan")).toHaveValue(null);
    expect(getField("Tanggal Penjualan")).toHaveValue("");
  });

  // WB-IP09: Mempertahankan formulir jika penyimpanan gagal
  it("WB-IP09: tidak mengosongkan formulir ketika server gagal menyimpan", async () => {
    global.fetch = vi.fn(async (url, options = {}) => {
      if (String(url).includes("/api/brand")) {
        return buatResponse({
          success: true,
          data: dataBrand,
        });
      }

      if (String(url).includes("/api/kategori")) {
        return buatResponse({
          success: true,
          data: dataKategori,
        });
      }

      if (
        String(url).includes("/api/penjualan") &&
        options.method === "POST"
      ) {
        return buatResponse({
          success: false,
          message: "Gagal menyimpan data",
        });
      }

      return buatResponse({
        success: false,
        data: [],
      });
    });

    render(<InputPenjualan />);

    await screen.findByRole("option", {
      name: "Brand Alpha",
    });

    isiForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan Data Penjualan",
      })
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Gagal menyimpan data"
      );
    });

    expect(getField("Nama Produk")).toHaveValue(
      "Produk Pengujian"
    );
  });

  // WB-IP10: Memastikan formulir menggunakan field wajib
  it("WB-IP10: memeriksa validasi field wajib pada formulir", () => {
    render(<InputPenjualan />);

    expect(getField("Brand")).toBeRequired();
    expect(getField("Kategori")).toBeRequired();
    expect(getField("Nama Produk")).toBeRequired();
    expect(getField("Nama Toko")).toBeRequired();
    expect(getField("Jumlah")).toBeRequired();
    expect(getField("Harga Satuan")).toBeRequired();
    expect(getField("Tanggal Penjualan")).toBeRequired();
  });
});

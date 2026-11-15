import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Laporan from "../src/pages/Laporan";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data, children, label }) => (
    <div data-testid="pie">
      {data?.map((item, index) => (
        <span key={index}>
          {label?.(item)}
          {children}
        </span>
      ))}
    </div>
  ),
  Cell: () => <div />,
  Legend: () => <div />,
}));

const mockLaporan = [
  {
    tanggal_penjualan: "2026-10-01",
    total_produk: 3,
    total_penjualan: 150000,
  },
  {
    tanggal_penjualan: "2026-10-02",
    total_produk: 2,
    total_penjualan: 250000,
  },
];

const mockBulanan = [{ bulan: "Oktober", total: 400000 }];

const mockBrand = [{ nama_brand: "Wardah", total: 200000 }];

const mockKategori = [
  { nama_kategori: "Skincare", total: "300000" },
  { nama_kategori: "Makeup", total: "100000" },
];

const setupApiSuccess = () => {
  axios.get.mockImplementation((url) => {
    if (url === "http://localhost:5000/api/laporan") {
      return Promise.resolve({
        data: { data: mockLaporan },
      });
    }

    if (url === "http://localhost:5000/api/laporan/bulanan") {
      return Promise.resolve({
        data: { data: mockBulanan },
      });
    }

    if (url === "http://localhost:5000/api/laporan/brand") {
      return Promise.resolve({
        data: { data: mockBrand },
      });
    }

    if (url === "http://localhost:5000/api/laporan/kategori") {
      return Promise.resolve({
        data: { data: mockKategori },
      });
    }

    return Promise.reject(new Error("URL API tidak dikenal"));
  });
};

describe("Laporan White Box Testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    setupApiSuccess();
  });

  const renderLaporan = () =>
    render(
      <MemoryRouter>
        <Laporan />
      </MemoryRouter>,
    );

  it("1. Menampilkan judul Laporan Penjualan", () => {
    renderLaporan();

    expect(
      screen.getByRole("heading", { name: "Laporan Penjualan" }),
    ).toBeInTheDocument();
  });

  it("2. Menampilkan input tanggal awal dan akhir", () => {
    renderLaporan();

    expect(document.querySelectorAll('input[type="date"]')).toHaveLength(2);
  });

  it("3. Menampilkan tombol Filter dan Export Excel", () => {
    renderLaporan();

    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Export Excel" }),
    ).toBeInTheDocument();
  });

  it("4. Mengambil data laporan dan grafik dari API saat halaman dibuka", async () => {
    renderLaporan();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/laporan",
        {
          params: {
            awal: "",
            akhir: "",
          },
        },
      );

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/laporan/bulanan",
      );

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/laporan/brand",
      );

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/laporan/kategori",
      );
    });
  });

  it("5. Menampilkan data penjualan dalam tabel", async () => {
    renderLaporan();

    expect(await screen.findByText("01 Oktober 2026")).toBeInTheDocument();

    expect(screen.getByText("02 Oktober 2026")).toBeInTheDocument();

    expect(screen.getByText(/150\.000/)).toBeInTheDocument();

    expect(screen.getByText(/250\.000/)).toBeInTheDocument();
  });

  it("6. Menghitung total penjualan dan total produk", async () => {
    renderLaporan();

    await screen.findByText("01 Oktober 2026");

    expect(screen.getByText("Rp 400.000")).toBeInTheDocument();

    expect(screen.getByText("5", { selector: "h2" })).toBeInTheDocument();
  });

  it("7. Mengirim tanggal filter ke API saat tombol Filter diklik", async () => {
    renderLaporan();

    await screen.findByText("01 Oktober 2026");

    const tanggal = document.querySelectorAll('input[type="date"]');

    fireEvent.change(tanggal[0], {
      target: { value: "2026-10-01" },
    });

    fireEvent.change(tanggal[1], {
      target: { value: "2026-10-31" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Filter" }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/laporan",
        {
          params: {
            awal: "2026-10-01",
            akhir: "2026-10-31",
          },
        },
      );
    });
  });

  it("8. Mengekspor laporan ke Excel melalui tab baru", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    renderLaporan();

    fireEvent.click(screen.getByRole("button", { name: "Export Excel" }));

    expect(openSpy).toHaveBeenCalledWith(
      "http://localhost:5000/api/laporan/export",
      "_blank",
    );

    openSpy.mockRestore();
  });

  it("9. Menampilkan judul grafik bulanan, brand, dan kategori", () => {
    renderLaporan();

    expect(
      screen.getByRole("heading", {
        name: "Penjualan Bulanan",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Penjualan Berdasarkan Brand",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Penjualan Berdasarkan Kategori",
      }),
    ).toBeInTheDocument();
  });

  it("10. Mengubah total kategori berbentuk string menjadi angka", async () => {
    renderLaporan();

    expect(await screen.findByText("Skincare")).toBeInTheDocument();

    expect(screen.getByText("Makeup")).toBeInTheDocument();

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("11. Menangani kegagalan API tanpa membuat halaman hilang", async () => {
    axios.get.mockRejectedValue(new Error("Gagal mengambil data"));

    renderLaporan();

    expect(
      screen.getByRole("heading", {
        name: "Laporan Penjualan",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it("12. Menampilkan total nol ketika data laporan kosong", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "http://localhost:5000/api/laporan") {
        return Promise.resolve({
          data: { data: [] },
        });
      }

      if (url === "http://localhost:5000/api/laporan/bulanan") {
        return Promise.resolve({
          data: { data: [] },
        });
      }

      if (url === "http://localhost:5000/api/laporan/brand") {
        return Promise.resolve({
          data: { data: [] },
        });
      }

      if (url === "http://localhost:5000/api/laporan/kategori") {
        return Promise.resolve({
          data: { data: [] },
        });
      }

      return Promise.reject(new Error("URL API tidak dikenal"));
    });

    renderLaporan();

    await waitFor(() => {
      expect(screen.getByText("Rp 0")).toBeInTheDocument();

      expect(screen.getByText("0", { selector: "h2" })).toBeInTheDocument();
    });
  });
});

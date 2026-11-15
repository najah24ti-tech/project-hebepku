import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";

import Dashboard from "../src/pages/Dashboard";

// Mock Recharts
vi.mock("recharts", () => ({
  LineChart: ({ children }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="chart-line" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

// Data pengujian penjualan
const dataPenjualan = [
  {
    id_penjualan: 1,
    id_user: 10,
    nama_produk: "Produk A",
    nama_brand: "Brand Alpha",
    nama_wilayah: "Pekanbaru",
    nama_toko: "Toko A",
    nama_ba: "BA A",
    tanggal_penjualan: "2026-10-01",
    jumlah: 2,
    total: 100000,
  },
  {
    id_penjualan: 2,
    id_user: 11,
    nama_produk: "Produk B",
    nama_brand: "Brand Beta",
    nama_wilayah: "Kampar",
    nama_toko: "Toko B",
    nama_ba: "BA B",
    tanggal_penjualan: "2026-10-10",
    jumlah: 3,
    total: 150000,
  },
  {
    id_penjualan: 3,
    id_user: 10,
    nama_produk: "Produk A",
    nama_brand: "Brand Alpha",
    nama_wilayah: "Pekanbaru",
    nama_toko: "Toko C",
    nama_ba: "BA A",
    tanggal_penjualan: "2026-10-15",
    jumlah: 1,
    total: 50000,
  },
];

// Data brand
const dataBrand = [
  { id_brand: 1, nama_brand: "Brand Alpha" },
  { id_brand: 2, nama_brand: "Brand Beta" },
];

// Helper response API
const buatResponse = (data) => ({
  ok: true,
  status: 200,
  json: async () => data,
});

// Mock API
const aturFetch = () => {
  global.fetch = vi.fn(async (url) => {
    const alamat = String(url);

    if (alamat.includes("/api/dashboard/detail")) {
      return buatResponse({
        success: true,
        data: dataPenjualan,
      });
    }

    if (alamat.includes("/api/brand")) {
      return buatResponse({
        success: true,
        data: dataBrand,
      });
    }

    if (alamat.includes("/api/dashboard/summary")) {
      return buatResponse({
        success: true,
        summary: {
          total_penjualan: 300000,
        },
      });
    }

    if (alamat.includes("/api/dashboard/chart")) {
      return buatResponse({
        success: true,
        data: [
          {
            bulan: "2026-10",
            total_penjualan: "300000",
          },
        ],
      });
    }

    return buatResponse({
      success: true,
      data: [],
    });
  });
};

// Helper identitas pengguna
const aturUser = (role = "owner", idUser = 10) => {
  localStorage.setItem("role", role);
  localStorage.setItem("nama", "Pengguna Tes");

  localStorage.setItem(
    "user",
    JSON.stringify({
      id_user: idUser,
      id: idUser,
      role,
    })
  );
};

describe("White Box Testing - Fitur Dashboard HEBEPKU", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    aturFetch();
    aturUser("owner", 10);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // WB-D01: Dashboard berhasil dirender dan memanggil API
  it("WB-D01: menampilkan dashboard dan mengambil data API", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByText("Grafik Penjualan Bulanan")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(
      global.fetch.mock.calls.some(([url]) =>
        String(url).includes("/api/dashboard/detail")
      )
    ).toBe(true);
  });

  // WB-D02: Dashboard menampilkan bagian grafik setelah data dimuat
  it("WB-D02: menampilkan bagian grafik penjualan", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByText("Grafik Penjualan Bulanan")
    ).toBeInTheDocument();
  });

  // WB-D03: Dashboard owner memuat data yang diperlukan
  it("WB-D03: memeriksa pemanggilan API untuk dashboard owner", async () => {
    render(<Dashboard />);

    await screen.findByText("Grafik Penjualan Bulanan");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const alamatAPI = global.fetch.mock.calls.map(([url]) =>
      String(url)
    );

    expect(
      alamatAPI.some((url) => url.includes("/api/dashboard/detail"))
    ).toBe(true);
  });

  // WB-D04: Grafik berhasil dirender
  it("WB-D04: menampilkan grafik penjualan", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByText("Grafik Penjualan Bulanan")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("responsive-container")
    ).toBeInTheDocument();
  });

  // WB-D05: Bagian produk teratas tersedia
  it("WB-D05: menampilkan bagian produk teratas", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByText("Top 5 Produk")
    ).toBeInTheDocument();
  });

  // WB-D06: Bagian brand teratas tersedia
  it("WB-D06: menampilkan bagian brand teratas", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByText("Top 5 Brand")
    ).toBeInTheDocument();
  });

  // WB-D07: Dashboard untuk role leader
  it("WB-D07: menampilkan dashboard untuk role leader", async () => {
    aturUser("leader", 10);

    render(<Dashboard />);

    expect(
      await screen.findByText("Grafik Penjualan Bulanan")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // WB-D08: Dashboard untuk role Business Analyst
  it("WB-D08: menampilkan tampilan khusus role ba", async () => {
    aturUser("ba", 10);

    render(<Dashboard />);

    expect(
      await screen.findByText("Aktivitas Input Terbaru")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Menampilkan data penjualan yang telah Anda input."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Grafik Penjualan Bulanan")
    ).not.toBeInTheDocument();
  });

  // WB-D09: Produk ditampilkan pada dashboard
  it("WB-D09: menampilkan nama produk pada dashboard", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByText("Top 5 Produk")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getAllByText("Produk B").length
      ).toBeGreaterThan(0);
    });
  });

  // WB-D10: Dashboard memanggil API untuk memuat data
  it("WB-D10: memeriksa pemanggilan API data dashboard", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByText("Grafik Penjualan Bulanan")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch.mock.calls.length).toBeGreaterThan(0);
    });

    expect(
      global.fetch.mock.calls.some(([url]) =>
        String(url).includes("/api/dashboard/detail")
      )
    ).toBe(true);
  });
});

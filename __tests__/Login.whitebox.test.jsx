import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Login from "../src/pages/auth/Login";

// Mock Axios
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock useNavigate
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = vi.fn();

const mockUser = {
  id: 1,
  nama: "Pengguna Tes",
  role: "owner",
  id_wilayah: 1,
  nama_wilayah: "Pekanbaru",
};

describe("White Box Testing - Fitur Login HEBEPKU", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);

    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // Fungsi untuk mengisi formulir login
  const isiFormLogin = () => {
    fireEvent.change(screen.getByPlaceholderText("Masukkan Email"), {
      target: {
        name: "email",
        value: "owner@hebepku.com",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: {
        name: "password",
        value: "password123",
      },
    });
  };

  // Fungsi untuk menekan tombol Login
  const klikLogin = () => {
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
  };

  // WB-01: Jalur login berhasil
  it("WB-01: berhasil login ketika response.data.success bernilai true", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        user: mockUser,
      },
    });

    render(<Login />);

    isiFormLogin();
    klikLogin();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/login",
      {
        email: "owner@hebepku.com",
        password: "password123",
      }
    );

    expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    expect(localStorage.getItem("role")).toBe("owner");
    expect(localStorage.getItem("nama")).toBe("Pengguna Tes");
    expect(localStorage.getItem("id_wilayah")).toBe("1");
    expect(localStorage.getItem("nama_wilayah")).toBe("Pekanbaru");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Login" })
      ).toBeInTheDocument();
    });
  });

  // WB-02: Respons login gagal
  it("WB-02: menampilkan error ketika response.data.success bernilai false", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: false,
        message: "Email atau password salah",
      },
    });

    render(<Login />);

    isiFormLogin();
    klikLogin();

    expect(
      await screen.findByText("Email atau password salah")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem("user")).toBeNull();
  });

  // WB-03: Server mengembalikan pesan error
  it("WB-03: menampilkan pesan error dari server ketika err.response tersedia", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Akun tidak ditemukan",
        },
      },
    });

    render(<Login />);

    isiFormLogin();
    klikLogin();

    expect(
      await screen.findByText("Akun tidak ditemukan")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // WB-04: Server tidak dapat dihubungi
  it("WB-04: menampilkan pesan ketika server tidak dapat dihubungi", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(<Login />);

    isiFormLogin();
    klikLogin();

    expect(
      await screen.findByText("Server tidak dapat dihubungi")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // WB-05: Pesan error menggunakan nilai default
  it("WB-05: menggunakan pesan Login gagal jika respons error server tidak memiliki message", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {},
      },
    });

    render(<Login />);

    isiFormLogin();
    klikLogin();

    expect(await screen.findByText("Login gagal")).toBeInTheDocument();
  });

  // WB-06: Jalur loading
  it("WB-06: menampilkan loading selama proses login berlangsung", async () => {
    let selesaikanLogin;

    axios.post.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          selesaikanLogin = resolve;
        })
    );

    render(<Login />);

    isiFormLogin();
    klikLogin();

    expect(await screen.findByText("Memproses...")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Loading..." })
    ).toBeDisabled();

    selesaikanLogin({
      data: {
        success: false,
        message: "Email atau password salah",
      },
    });

    expect(
      await screen.findByText("Email atau password salah")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Login" })
      ).toBeEnabled();
    });

    expect(screen.queryByText("Memproses...")).not.toBeInTheDocument();
  });

  // WB-07: Jalur menampilkan dan menyembunyikan password
  it("WB-07: mengubah tampilan password dari tersembunyi menjadi terlihat", () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText("********");

    const tombolPassword = document.querySelector(
      'button[type="button"]'
    );

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(tombolPassword);

    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(tombolPassword);

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  // WB-08: Jalur login ulang setelah gagal
  it("WB-08: menghapus pesan error sebelumnya ketika login dikirim ulang", async () => {
    axios.post
      .mockResolvedValueOnce({
        data: {
          success: false,
          message: "Email atau password salah",
        },
      })
      .mockResolvedValueOnce({
        data: {
          success: false,
          message: "Akun tidak aktif",
        },
      });

    render(<Login />);

    isiFormLogin();
    klikLogin();

    expect(
      await screen.findByText("Email atau password salah")
    ).toBeInTheDocument();

    // Tunggu sampai proses login pertama selesai
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Login" })
      ).toBeEnabled();
    });

    klikLogin();

    expect(
      await screen.findByText("Akun tidak aktif")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Email atau password salah")
    ).not.toBeInTheDocument();

    expect(axios.post).toHaveBeenCalledTimes(2);
  });
});

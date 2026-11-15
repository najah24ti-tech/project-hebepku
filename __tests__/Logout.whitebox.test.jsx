import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Logout from "../src/pages/Logout";

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock gambar logout
vi.mock("../src/assets/images/logout.png", () => ({
  default: "logout-test.png",
}));

describe("Logout White Box Testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    localStorage.setItem("user", JSON.stringify({ id: 1 }));
    localStorage.setItem("role", "owner");
    localStorage.setItem("nama", "Najah");
  });

  const renderLogout = () =>
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>,
    );

  it("1. Menampilkan judul Logout", () => {
    renderLogout();

    expect(screen.getByRole("heading", { name: "Logout" })).toBeInTheDocument();
  });

  it("2. Menampilkan konfirmasi keluar aplikasi", () => {
    renderLogout();

    expect(
      screen.getByText(/Apakah Anda yakin ingin keluar dari aplikasi/i),
    ).toBeInTheDocument();
    expect(screen.getByText("HEBEPKU")).toBeInTheDocument();
  });

  it("3. Menampilkan informasi sebelum mengakhiri sesi", () => {
    renderLogout();

    expect(
      screen.getByText(/Pastikan seluruh data sudah tersimpan/i),
    ).toBeInTheDocument();
  });

  it("4. Menampilkan tombol Batalkan", () => {
    renderLogout();

    expect(
      screen.getByRole("button", { name: /Batalkan/i }),
    ).toBeInTheDocument();
  });

  it("5. Menampilkan tombol Logout", () => {
    renderLogout();

    expect(
      screen.getByRole("button", { name: /^Logout$/i }),
    ).toBeInTheDocument();
  });

  it("6. Menampilkan gambar logout", () => {
    renderLogout();

    expect(screen.getByAltText("Logout")).toHaveAttribute(
      "src",
      "logout-test.png",
    );
  });

  it("7. Menampilkan hak cipta HEBEPKU tahun 2026", () => {
    renderLogout();

    expect(screen.getByText("© 2026 HEBEPKU")).toBeInTheDocument();
  });

  it("8. Tombol Batalkan kembali ke halaman sebelumnya", () => {
    renderLogout();

    fireEvent.click(screen.getByRole("button", { name: /Batalkan/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("9. Tombol Logout menghapus data user, role, dan nama", () => {
    renderLogout();

    fireEvent.click(screen.getByRole("button", { name: /^Logout$/i }));

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
    expect(localStorage.getItem("nama")).toBeNull();
  });

  it("10. Tombol Logout mengarahkan pengguna ke halaman login", () => {
    renderLogout();

    fireEvent.click(screen.getByRole("button", { name: /^Logout$/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      replace: true,
    });
  });
});

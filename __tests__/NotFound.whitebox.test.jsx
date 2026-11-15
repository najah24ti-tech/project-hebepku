import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../src/pages/NotFound";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NotFound White Box Testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNotFound = (props = {}) =>
    render(
      <MemoryRouter>
        <NotFound {...props} />
      </MemoryRouter>,
    );

  it("1. Menampilkan kode error default 404", () => {
    renderNotFound();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
  });

  it("2. Menampilkan judul default Page Not Found", () => {
    renderNotFound();

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Page Not Found",
    );
  });

  it("3. Menampilkan deskripsi default", () => {
    renderNotFound();

    expect(
      screen.getByText("Halaman tidak ditemukan atau sudah dipindahkan."),
    ).toBeInTheDocument();
  });

  it("4. Menampilkan tombol Dashboard", () => {
    renderNotFound();

    expect(
      screen.getByRole("button", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });

  it("5. Menampilkan tombol Back", () => {
    renderNotFound();

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("6. Menampilkan nilai custom dari props", () => {
    renderNotFound({
      code: "500",
      title: "Server Error",
      description: "Terjadi kesalahan pada server.",
    });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("500");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Server Error",
    );
    expect(
      screen.getByText("Terjadi kesalahan pada server."),
    ).toBeInTheDocument();
  });

  it("7. Mengarahkan ke Dashboard saat tombol Dashboard diklik", () => {
    renderNotFound();

    fireEvent.click(screen.getByRole("button", { name: "Dashboard" }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("8. Kembali ke halaman sebelumnya saat tombol Back diklik", () => {
    renderNotFound();

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("9. Menggunakan kode error default saat props code tidak diberikan", () => {
    renderNotFound({ title: "Halaman Tidak Tersedia" });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Halaman Tidak Tersedia",
    );
  });

  it("10. Menggunakan deskripsi default saat props description tidak diberikan", () => {
    renderNotFound({ code: "403" });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("403");
    expect(
      screen.getByText("Halaman tidak ditemukan atau sudah dipindahkan."),
    ).toBeInTheDocument();
  });
});

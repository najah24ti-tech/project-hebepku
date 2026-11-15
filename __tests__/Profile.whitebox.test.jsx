import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../src/pages/Profile.jsx";

// Data dummy pengguna
const userDummy = {
  id_user: 1,
  nama: "Najah",
  email: "najah@example.com",
  role: "leader",
};

const profileDummy = {
  success: true,
  user: {
    nama: "Najah",
    email: "najah@example.com",
    role: "leader",
  },
};

const buatResponse = (data) => ({
  ok: true,
  json: async () => data,
});

const renderProfile = async () => {
  let hasil;

  await act(async () => {
    hasil = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
  });

  return hasil;
};

describe("White Box Testing - Profile HEBEPKU", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(userDummy));

    global.fetch = vi.fn(() => Promise.resolve(buatResponse(profileDummy)));

    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal("console", {
      ...console,
      log: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("WB-PF01 - menampilkan halaman Profile", async () => {
    await renderProfile();

    expect(screen.getByText("Nama")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Role")).toBeTruthy();
    expect(screen.getByText("Password Baru")).toBeTruthy();
    expect(screen.getByText("Konfirmasi Password")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Simpan Perubahan" }),
    ).toBeTruthy();
  });

  it("WB-PF02 - mengambil data profile dari API", async () => {
    await renderProfile();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/auth/profile/1",
      );
    });

    expect(screen.getByDisplayValue("Najah")).toBeTruthy();
    expect(screen.getByDisplayValue("najah@example.com")).toBeTruthy();
    expect(screen.getByDisplayValue("leader")).toBeTruthy();
  });

  it("WB-PF03 - menampilkan nama pengguna pada header", async () => {
    await renderProfile();

    expect(await screen.findByText("Najah")).toBeTruthy();
    expect(screen.getByText("leader")).toBeTruthy();
  });

  it("WB-PF04 - memperbarui input nama dan email", async () => {
    await renderProfile();

    const inputNama = await screen.findByDisplayValue("Najah");
    const inputEmail = screen.getByDisplayValue("najah@example.com");

    fireEvent.change(inputNama, {
      target: { name: "nama", value: "Najah Zahara" },
    });

    fireEvent.change(inputEmail, {
      target: {
        name: "email",
        value: "najahbaru@example.com",
      },
    });

    expect(screen.getByDisplayValue("Najah Zahara")).toBeTruthy();
    expect(screen.getByDisplayValue("najahbaru@example.com")).toBeTruthy();
  });

  it("WB-PF05 - role tidak dapat diubah", async () => {
    await renderProfile();

    const inputRole = await screen.findByDisplayValue("leader");

    expect(inputRole.readOnly).toBe(true);
  });

  it("WB-PF06 - menampilkan password ketika tombol lihat ditekan", async () => {
    await renderProfile();

    const inputPassword = screen.getByPlaceholderText(
      "Kosongkan jika tidak ingin mengganti password",
    );

    expect(inputPassword.type).toBe("password");

    const tombolLihat = inputPassword.parentElement.querySelector("button");

    fireEvent.click(tombolLihat);

    expect(inputPassword.type).toBe("text");
  });

  it("WB-PF07 - menampilkan konfirmasi password ketika tombol lihat ditekan", async () => {
    await renderProfile();

    const inputKonfirmasi = screen.getByPlaceholderText(
      "Masukkan kembali password",
    );

    expect(inputKonfirmasi.type).toBe("password");

    const tombolLihat = inputKonfirmasi.parentElement.querySelector("button");

    fireEvent.click(tombolLihat);

    expect(inputKonfirmasi.type).toBe("text");
  });

  it("WB-PF08 - menolak perubahan jika konfirmasi password tidak sama", async () => {
    await renderProfile();

    fireEvent.change(
      screen.getByPlaceholderText(
        "Kosongkan jika tidak ingin mengganti password",
      ),
      {
        target: {
          name: "password",
          value: "password123",
        },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("Masukkan kembali password"), {
      target: {
        name: "konfirmasi",
        value: "password456",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan Perubahan",
      }),
    );

    expect(global.alert).toHaveBeenCalledWith("Konfirmasi password tidak sama");

    // Fetch hanya dipanggil untuk mengambil data profil
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("WB-PF09 - menyimpan perubahan profile ketika API berhasil", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(buatResponse(profileDummy))
      .mockResolvedValueOnce(buatResponse({ success: true }));

    await renderProfile();

    fireEvent.change(await screen.findByDisplayValue("Najah"), {
      target: {
        name: "nama",
        value: "Najah Zahara",
      },
    });

    fireEvent.change(screen.getByDisplayValue("najah@example.com"), {
      target: {
        name: "email",
        value: "najahbaru@example.com",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan Perubahan",
      }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      "http://localhost:5000/api/auth/profile/1",
      expect.objectContaining({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: "Najah Zahara",
          email: "najahbaru@example.com",
          password: "",
        }),
      }),
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Profil berhasil diperbarui!");
    });

    expect(JSON.parse(localStorage.getItem("user")).nama).toBe("Najah Zahara");

    expect(JSON.parse(localStorage.getItem("user")).email).toBe(
      "najahbaru@example.com",
    );

    expect(localStorage.getItem("nama")).toBe("Najah Zahara");
  });

  it("WB-PF10 - menampilkan pesan jika API gagal memperbarui profile", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(buatResponse(profileDummy))
      .mockResolvedValueOnce(
        buatResponse({
          success: false,
          message: "Email sudah digunakan",
        }),
      );

    await renderProfile();

    fireEvent.change(await screen.findByDisplayValue("Najah"), {
      target: {
        name: "nama",
        value: "Najah Baru",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan Perubahan",
      }),
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Email sudah digunakan");
    });
  });
});

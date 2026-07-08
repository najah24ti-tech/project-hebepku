import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

// Routes
import dashboardRoutes from "./routes/dashboardRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import wilayahRoutes from "./routes/wilayahRoutes.js";
import kategoriRoutes from "./routes/kategoriRoutes.js";
import penjualanRoutes from "./routes/penjualanRoutes.js";
import laporanRoutes from "./routes/laporanRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(express.json());

// ========================================
// TEST SERVER
// ========================================
app.get("/", (req, res) => {
  res.send("🚀 Backend Hebepku berjalan!");
});

// ========================================
// ROUTES
// ========================================
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/wilayah", wilayahRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/penjualan", penjualanRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// ========================================
// SERVER
// ========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
import express from "express";

import {
  getLaporan,
  getBulanan,
  getBrand,
  getKategori,
  exportExcel,
} from "../controllers/laporanController.js";

const router = express.Router();

router.get("/", getLaporan);

router.get("/bulanan", getBulanan);

router.get("/brand", getBrand);

router.get("/kategori", getKategori);

router.get("/export", exportExcel);

export default router;
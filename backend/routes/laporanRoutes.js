import express from "express";
import {
  getLaporan,
  getBulanan,
  getBrand,
  getKategori,
} from "../controllers/laporanController.js";

const router = express.Router();

router.get("/", getLaporan);
router.get("/bulanan", getBulanan);

router.get("/brand", getBrand);

router.get("/kategori", getKategori);
export default router;

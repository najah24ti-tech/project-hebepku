import express from "express";

import {
  getPenjualan,
  tambahPenjualan
} from "../controllers/penjualanController.js";


const router = express.Router();


// GET semua penjualan
router.get("/", getPenjualan);


// POST tambah penjualan
router.post("/", tambahPenjualan);


export default router;
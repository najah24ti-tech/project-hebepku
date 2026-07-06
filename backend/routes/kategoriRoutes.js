import express from "express";
import { getKategori } from "../controllers/kategoriController.js";

const router = express.Router();

router.get("/", getKategori);

export default router;
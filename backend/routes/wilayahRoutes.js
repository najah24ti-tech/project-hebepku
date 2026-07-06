import express from "express";
import { getWilayah } from "../controllers/wilayahController.js";

const router = express.Router();

router.get("/", getWilayah);

export default router;
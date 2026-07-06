import express from "express";

import {
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.get("/profile/:id", getProfile);

router.put("/profile/:id", updateProfile);

export default router;
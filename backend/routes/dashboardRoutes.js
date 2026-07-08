import express from "express";

import {
  getDashboardOwner,
  getDashboardSummary,
  getDashboardChart,
} from "../controllers/dashboardController.js";

const router = express.Router();

// =================================
// GET DETAIL DATA PENJUALAN
// URL:
// localhost:5000/api/dashboard/detail
// =================================

router.get("/detail", getDashboardOwner);

// =================================
// GET SUMMARY DASHBOARD
// URL:
// localhost:5000/api/dashboard/summary
// =================================

router.get("/summary", getDashboardSummary);

router.get("/chart", getDashboardChart);

export default router;

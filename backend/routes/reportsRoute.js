const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const reportController = require("../controllers/reportController");

// Ajouter un rapport
router.post("/add-report", authMiddleware.isAdmin, reportController.addReport);

// Récupérer tous les rapports avec filtres
router.post(
  "/get-all-reports",
  authMiddleware.isAdmin,
  reportController.getAllReports
);

// Récupérer tous les rapports d'un utilisateur spécifique
router.post(
  "/get-all-reports-by-user",
  authMiddleware.isAdmin,
  reportController.getAllReportsByUser
);

module.exports = router;

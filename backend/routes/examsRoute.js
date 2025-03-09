const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const examController = require("../controllers/quiz");

// Routes pour les examens
router.post("/add", examController.addExam);
router.post("/get-all-exams", examController.getAllExams);
router.post("/get-exam-by-id", authMiddleware.auth, examController.getExamById);
router.post(
  "/edit-exam-by-id",
  authMiddleware.isAdmin,
  examController.editExamById
);
router.post(
  "/delete-exam-by-id",
  authMiddleware.isAdmin,
  examController.deleteExamById
);

// Routes pour les questions d'examen
router.post(
  "/add-question-to-exam",
  authMiddleware.isAdmin,
  examController.addQuestionToExam
);
router.post(
  "/edit-question-in-exam",
  authMiddleware.isAdmin,
  examController.editQuestionInExam
);
router.post(
  "/delete-question-in-exam",
  authMiddleware.isAdmin,
  examController.deleteQuestionInExam
);
//router.get("/get-quiz", examController.getAllExams);

module.exports = router;

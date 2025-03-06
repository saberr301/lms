const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
require("dotenv").config();

const User = require("../models/user");
const Course = require("../models/course");
const CourseProgress = require("../models/courseProgress");
const { default: mongoose } = require("mongoose");

// ================ Inscription gratuite à un cours ================
exports.enrollFreeCourse = async (req, res) => {
  // Extraire courseId & userId
  const { coursesId } = req.body;
  const userId = req.user.id;

  if (!coursesId || coursesId.length === 0) {
    return res.json({
      success: false,
      message: "Veuillez fournir un ID de cours.",
    });
  }

  for (const course_id of coursesId) {
    let course;
    try {
      // Vérifier si le cours existe
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Cours introuvable." });
      }

      // Vérifier si l'utilisateur est déjà inscrit
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(400)
          .json({ success: false, message: "L'étudiant est déjà inscrit." });
      }

      // Inscrire l'étudiant gratuitement
      await enrollStudent(course_id, userId);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res
    .status(200)
    .json({ success: true, message: "Inscription réussie." });
};

// ================ Fonction d'inscription de l'étudiant ================
const enrollStudent = async (courseId, userId) => {
  try {
    // Ajouter l'utilisateur à la liste des étudiants inscrits
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) {
      throw new Error("Cours introuvable.");
    }

    // Initialiser la progression du cours
    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    });

    // Ajouter le cours à la liste des cours de l'étudiant
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );

    // Envoyer un email de confirmation
    await mailSender(
      enrolledStudent.email,
      `Inscription réussie dans ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName}`
      )
    );
  } catch (error) {
    console.log(error);
    throw new Error("Erreur lors de l'inscription de l'étudiant.");
  }
};

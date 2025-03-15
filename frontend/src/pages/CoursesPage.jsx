import React, { useState, useEffect } from "react";
import { getAllCourses } from "../services/operations/courseDetailsAPI"; // Assurez-vous que la fonction `fetchAllCourses` est bien définie
import CourseCard from "../components/core/Catalog/Course_Card"; // Utilisation de CourseDetailsCard
import { toast } from "react-hot-toast";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses(); // Cette fonction est censée retourner les données des cours
      setCourses(response);
    } catch (error) {
      toast.error("Erreur lors de la récupération des cours.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(); // Charger les cours lors du premier rendu
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-10 text-white">
        Tous les Cours
      </h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                handleEnrollCourse={() => {}}
                setConfirmationModal={() => {}}
              />
            ))
          ) : (
            <p>Aucun cours disponible pour le moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;

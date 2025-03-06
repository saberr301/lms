import { useEffect } from "react";
import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Add Course
        </h1>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 ">
        <p className="mb-8 text-lg text-richblack-5">
          ⚡ Conseils pour le téléchargement de cours
        </p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <li>La taille standard de la vignette du cours est de 1024 x 576.</li>
          <li>La section Vidéo contrôle la vidéo de présentation du cours.</li>
          <li>
            Course Builder est l'endroit où vous créez et organisez un cours.
          </li>
          <li>
            Ajoutez des sujets dans la section Course Builder pour créer des
            leçons, des quiz, et les missions.
          </li>
          <li>
            Les informations de la section Données supplémentaires apparaissent
            sur le cours une seule page.
          </li>
          <li>Faites des annonces pour avertir tout événement important</li>
          <li>Notes à tous les étudiants inscrits en même temps.</li>
        </ul>
      </div>
    </div>
  );
}

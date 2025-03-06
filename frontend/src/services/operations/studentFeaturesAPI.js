import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const { COURSE_ENROLL_API } = studentEndpoints;

// ================ Enroll Course for Free ================
export async function enrollFreeCourse(
  token,
  coursesId,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Enrolling in course...");

  try {
    // Envoyer la requête d'inscription gratuite
    const response = await apiConnector(
      "POST",
      COURSE_ENROLL_API,
      { coursesId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Successfully enrolled in the course!");
    navigate("/dashboard/enrolled-courses");
  } catch (error) {
    console.log("ENROLLMENT API ERROR.....", error);
    toast.error(
      error.response?.data?.message || "Could not enroll in the course"
    );
  }

  toast.dismiss(toastId);
}

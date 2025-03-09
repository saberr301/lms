import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { examsEndpoints } from "../../apis";

const {
  ADD_EXAM_API,
  GET_ALL_EXAMS_API,
  GET_EXAM_BY_ID_API,
  EDIT_EXAM_API,
  DELETE_EXAM_API,
  ADD_QUESTION_API,
  EDIT_QUESTION_API,
  DELETE_QUESTION_API,
} = examsEndpoints;

// ================== Add Exam ==================
export const addExam = async (data) => {
  const toastId = toast.loading("Adding exam...");
  let result = null;
  try {
    const response = await apiConnector("POST", ADD_EXAM_API, data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Exam added successfully");
    result = response.data;
  } catch (error) {
    toast.error(error.message);
    console.log("ADD_EXAM_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Get All Exams ==================
export const getAllExams = async () => {
  const toastId = toast.loading("Loading exams...");
  let result = [];
  try {
    const response = await apiConnector("POST", GET_ALL_EXAMS_API);
    if (!response.data.success) throw new Error("Failed to fetch exams");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("GET_ALL_EXAMS_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Get Exam By ID ==================
export const getExamById = async (examId) => {
  const toastId = toast.loading("Loading exam details...");
  let result = null;
  try {
    const response = await apiConnector("POST", GET_EXAM_BY_ID_API, { examId });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("GET_EXAM_BY_ID_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Edit Exam ==================
export const editExam = async (data) => {
  const toastId = toast.loading("Updating exam...");
  let result = null;
  try {
    const response = await apiConnector("POST", EDIT_EXAM_API, data);
    if (!response.data.success) throw new Error("Failed to update exam");
    toast.success("Exam updated successfully");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("EDIT_EXAM_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Delete Exam ==================
export const deleteExam = async (examId) => {
  const toastId = toast.loading("Deleting exam...");
  let result = false;
  try {
    const response = await apiConnector("POST", DELETE_EXAM_API, { examId });
    if (!response.data.success) throw new Error("Failed to delete exam");
    toast.success("Exam deleted successfully");
    result = true;
  } catch (error) {
    toast.error(error.message);
    console.log("DELETE_EXAM_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Add Question to Exam ==================
export const addQuestionToExam = async (data) => {
  const toastId = toast.loading("Adding question...");
  let result = null;
  try {
    const response = await apiConnector("POST", ADD_QUESTION_API, data);
    if (!response.data.success) throw new Error("Failed to add question");
    toast.success("Question added successfully");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("ADD_QUESTION_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Edit Question ==================
export const editQuestion = async (data) => {
  const toastId = toast.loading("Updating question...");
  let result = null;
  try {
    const response = await apiConnector("POST", EDIT_QUESTION_API, data);
    if (!response.data.success) throw new Error("Failed to update question");
    toast.success("Question updated successfully");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("EDIT_QUESTION_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Delete Question ==================
export const deleteQuestion = async (questionId) => {
  const toastId = toast.loading("Deleting question...");
  let result = false;
  try {
    const response = await apiConnector("POST", DELETE_QUESTION_API, {
      questionId,
    });
    if (!response.data.success) throw new Error("Failed to delete question");
    toast.success("Question deleted successfully");
    result = true;
  } catch (error) {
    toast.error(error.message);
    console.log("DELETE_QUESTION_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

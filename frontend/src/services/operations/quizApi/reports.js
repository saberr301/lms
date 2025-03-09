import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { reportsEndpoints } from "../../apis";

const { ADD_REPORT_API, GET_ALL_REPORTS_API, GET_USER_REPORTS_API } =
  reportsEndpoints;

// ================== Add Report ==================
export const addReport = async (data) => {
  const toastId = toast.loading("Submitting report...");
  let result = null;
  try {
    const response = await apiConnector("POST", ADD_REPORT_API, data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Report submitted successfully");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("ADD_REPORT_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Get All Reports ==================
export const getAllReports = async (filters = {}) => {
  const toastId = toast.loading("Loading reports...");
  let result = [];
  try {
    const response = await apiConnector("POST", GET_ALL_REPORTS_API, filters);
    if (!response.data.success) throw new Error("Failed to fetch reports");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("GET_ALL_REPORTS_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// ================== Get User Reports ==================
export const getUserReports = async () => {
  const toastId = toast.loading("Loading your reports...");
  let result = [];
  try {
    const response = await apiConnector("POST", GET_USER_REPORTS_API, null);
    if (!response.data.success) throw new Error("Failed to fetch user reports");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
    console.log("GET_USER_REPORTS_API ERROR: ", error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

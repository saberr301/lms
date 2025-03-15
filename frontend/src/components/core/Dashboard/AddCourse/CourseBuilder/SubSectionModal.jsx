import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { FaFile, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
  addResource,
  deleteResource,
  getResources,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [resources, setResources] = useState([]);
  const [resourceFile, setResourceFile] = useState(null);
  const [resourceType, setResourceType] = useState("pdf");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);

      // Fetch resources for this subsection
      if (modalData._id) {
        fetchResources(modalData._id);
      }
    }
  }, []);

  const fetchResources = async (subSectionId) => {
    try {
      const response = await getResources(subSectionId, token);
      if (response.success) {
        setResources(response.data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to fetch resources");
    }
  };

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);
    setLoading(true);
    const result = await createSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setLoading(false);
    setModalData(null);
  };

  // Handle resource file change
  const handleResourceFileChange = (file) => {
    setResourceFile(file);
  };

  // Handle resource submission
  const handleAddResource = async () => {
    if (!resourceFile || !resourceTitle || !resourceType) {
      toast.error("Please provide all required fields for the resource");
      return;
    }

    setResourceLoading(true);
    const formData = new FormData();
    formData.append("subSectionId", modalData._id);
    formData.append("resourceTitle", resourceTitle);
    formData.append("resourceDescription", resourceDescription);
    formData.append("resourceType", resourceType);
    formData.append("resourceFile", resourceFile);

    try {
      const result = await addResource(formData, token);
      if (result.success) {
        toast.success("Resource added successfully");
        setResources([
          ...resources,
          result.data.resources[result.data.resources.length - 1],
        ]);

        // Reset form fields
        setResourceFile(null);
        setResourceTitle("");
        setResourceDescription("");
        setResourceType("pdf");
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Failed to add resource");
    }
    setResourceLoading(false);
  };

  // Handle resource deletion
  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setResourceLoading(true);
    try {
      const result = await deleteResource(
        {
          subSectionId: modalData._id,
          resourceId: resourceId,
        },
        token
      );

      if (result.success) {
        toast.success("Resource deleted successfully");
        setResources(
          resources.filter((resource) => resource._id !== resourceId)
        );
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
    setResourceLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-3xl rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button
            onClick={() => !loading && !resourceLoading && setModalData(null)}
          >
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-5">
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="text-xs text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="text-xs text-pink-200">
                Lecture description is required
              </span>
            )}
          </div>

          {/* Resources Section (only visible in edit or view mode) */}
          {(edit || view) && modalData._id && (
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-richblack-5">
                Resources
              </h3>

              {/* List of existing resources */}
              <div className="space-y-3">
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <div
                      key={resource._id}
                      className="flex items-center justify-between p-3 bg-richblack-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FaFile className="text-richblack-100" />
                        <div>
                          <p className="text-sm font-medium text-richblack-5">
                            {resource.title}
                          </p>
                          {resource.description && (
                            <p className="text-xs text-richblack-300">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-richblack-300 underline hover:text-blue-100"
                        >
                          View
                        </a>
                        {edit && !view && (
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(resource._id)}
                            disabled={resourceLoading}
                            className="text-pink-200 hover:text-pink-300"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-richblack-300">
                    No resources available
                  </p>
                )}
              </div>

              {/* Add new resource form (only in edit mode) */}
              {edit && !view && (
                <div className="mt-4 p-4 bg-richblack-700 rounded-lg">
                  <h4 className="text-base font-medium text-richblack-5 mb-4">
                    Add New Resource
                  </h4>

                  <div className="space-y-4">
                    {/* Resource Title */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm text-richblack-200">
                        Resource Title <sup className="text-pink-200">*</sup>
                      </label>
                      <input
                        type="text"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        placeholder="Enter Resource Title"
                        className="form-style w-full"
                        disabled={resourceLoading}
                      />
                    </div>

                    {/* Resource Description */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm text-richblack-200">
                        Resource Description
                      </label>
                      <textarea
                        value={resourceDescription}
                        onChange={(e) => setResourceDescription(e.target.value)}
                        placeholder="Enter Resource Description (optional)"
                        className="form-style resize-none min-h-[80px] w-full"
                        disabled={resourceLoading}
                      />
                    </div>

                    {/* Resource Type */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm text-richblack-200">
                        Resource Type <sup className="text-pink-200">*</sup>
                      </label>
                      <select
                        value={resourceType}
                        onChange={(e) => setResourceType(e.target.value)}
                        className="form-style w-full"
                        disabled={resourceLoading}
                      >
                        <option value="pdf">PDF</option>
                        <option value="image">Image</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Resource File Upload */}
                    <Upload
                      name="resourceFile"
                      label="Resource File"
                      setValue={() => {}}
                      errors={{}}
                      video={false}
                      viewData={null}
                      editData={null}
                      customChangeHandler={handleResourceFileChange}
                    />

                    {/* Add Resource Button */}
                    <button
                      type="button"
                      onClick={handleAddResource}
                      disabled={resourceLoading}
                      className="mt-4 rounded-md bg-yellow-50 px-5 py-2 text-center text-sm font-semibold text-black"
                    >
                      {resourceLoading ? "Adding..." : "Add Resource"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex justify-end gap-x-4">
            {!view && (
              <IconBtn
                disabled={loading || resourceLoading}
                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                type="submit"
              />
            )}
            <button
              type="button"
              onClick={() => setModalData(null)}
              disabled={loading || resourceLoading}
              className="rounded-md bg-richblack-300 px-5 py-2 text-center text-sm font-semibold text-richblack-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { FaFileAlt, FaFileImage, FaFileDownload } from "react-icons/fa";
import { getResources } from "../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";

export default function ResourcesTab({ subSectionId }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (
      subSectionId &&
      subSectionId !== "undefined" &&
      subSectionId !== undefined
    ) {
      fetchResources();
    }
  }, [subSectionId]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await getResources(subSectionId, token);
      if (response.success) {
        setResources(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
    setLoading(false);
  };

  const getResourceIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <FaFileAlt className="text-red-500" size={24} />;
      case "image":
        return <FaFileImage className="text-blue-500" size={24} />;
      default:
        return <FaFileDownload className="text-green-500" size={24} />;
    }
  };

  return (
    <div className="p-6 bg-richblack-800 rounded-lg">
      <h2 className="text-xl font-bold text-richblack-5 mb-6">
        Ressources du cours
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-50"></div>
        </div>
      ) : resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="flex items-center p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all"
            >
              <div className="mr-4">{getResourceIcon(resource.fileType)}</div>
              <div className="flex-grow">
                <h3 className="text-richblack-5 font-medium">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="text-sm text-richblack-300 mt-1">
                    {resource.description}
                  </p>
                )}
                <p className="text-xs text-richblack-400 mt-1">
                  Ajouté le {new Date(resource.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-100 transition-all"
                download
              >
                Télécharger
                <FaFileDownload size={16} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-richblack-300">
            Aucune ressource disponible pour cette section
          </p>
        </div>
      )}
    </div>
  );
}

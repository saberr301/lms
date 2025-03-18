import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiConnector";
import { courseEndpoints } from "../../../../services/apis";

export default function UploadPDF({ subSectionId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    console.log("🔄 useEffect exécuté !");
    fetchResources();
  }, [subSectionId]);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("subSectionId", subSectionId);
    formData.append("pdf", selectedFile);

    try {
      const response = await apiConnector(
        "POST",
        courseEndpoints.UPLOAD_PDF,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response?.data?.success) {
        toast.success("PDF uploaded successfully");
        setResources([...resources, response.data.data.resources]);
        setSelectedFile(null);
      } else {
        toast.error("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading PDF");
    }
  };

  const fetchResources = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${courseEndpoints.GET_PDFS}/${subSectionId}`
      );

      if (response?.data?.success) {
        console.log(
          "📂 Données récupérées depuis l'API :",
          response.data.resources
        ); // ✅ Vérifier en console
        setResources(response.data.resources);
      } else {
        toast.error("Échec du chargement des fichiers");
      }
    } catch (error) {
      console.error("❌ Erreur récupération fichiers :", error);
      toast.error("Erreur lors du chargement des fichiers");
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white p-2 rounded-md ml-2"
      >
        Upload PDF
      </button>

      <h3 className="mt-4 font-semibold">Resources:</h3>
      <ul>
        {resources.map((resource, index) => (
          <li key={index}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              {resource.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

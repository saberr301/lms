import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function UploadPdf({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
  customChangeHandler = null,
}) {
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || null
  );
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      previewFile(file);

      if (customChangeHandler) {
        customChangeHandler(file);
      } else {
        setValue(name, file);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "video/*": video ? [] : [".mp4"],
      "image/*": !video ? [] : [".jpg", ".jpeg", ".png"],
      "application/pdf": !video ? [] : [".pdf"],
    },
    onDrop,
  });

  const previewFile = (file) => {
    // Si c'est une vidéo ou un document non prévisualisable
    if (
      video ||
      file.type === "application/pdf" ||
      file.type.includes("application/")
    ) {
      setPreviewSource(URL.createObjectURL(file));
      return;
    }
    // Si c'est une image
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    if (editData || viewData) {
      setPreviewSource(editData || viewData);
    }
  }, [editData, viewData]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {video || previewSource.includes("video") ? (
              <video
                src={previewSource}
                controls
                className="h-full w-full"
              ></video>
            ) : previewSource.includes("pdf") ||
              previewSource.includes("application") ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <FiUploadCloud className="text-4xl text-richblack-200" />
                <p className="text-center text-richblack-200">
                  {selectedFile?.name || "Document prêt pour téléchargement"}
                </p>
              </div>
            ) : (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource(null);
                  setSelectedFile(null);
                  setValue(name, null);
                  if (customChangeHandler) customChangeHandler(null);
                }}
                className="mt-3 text-sm text-richblack-400 underline"
              >
                Supprimer {video ? "la vidéo" : "le fichier"}
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex w-full flex-col items-center p-6"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Glissez-déposez {video ? "une vidéo" : "un fichier"}, ou{" "}
              <span className="font-semibold text-yellow-50">parcourez</span>
              <br />
              Taille maximale : {video ? "1GB" : "100MB"}
            </p>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="text-xs text-pink-200">{label} est requis</span>
      )}
    </div>
  );
}

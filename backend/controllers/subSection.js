const Section = require("../models/section");
const SubSection = require("../models/subSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// ================ create SubSection ================
exports.createSubSection = async (req, res) => {
  try {
    // extract data
    const { title, description, sectionId } = req.body;

    // extract video file
    const videoFile = req.files.video;
    // console.log('videoFile ', videoFile)

    // validation
    if (!title || !description || !videoFile || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const videoFileDetails = await uploadImageToCloudinary(
      videoFile,
      process.env.FOLDER_NAME
    );

    // create entry in DB
    const SubSectionDetails = await SubSection.create({
      title,
      timeDuration: videoFileDetails.duration,
      description,
      videoUrl: videoFileDetails.secure_url,
    });

    // link subsection id to section
    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // return response
    res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection created successfully",
    });
  } catch (error) {
    console.log("Error while creating SubSection");
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while creating SubSection",
    });
  }
};

// ================ Update SubSection ================
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    // validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSection ID is required to update",
      });
    }

    // find in DB
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // add data
    if (title) {
      subSection.title = title;
    }

    if (description) {
      subSection.description = description;
    }

    // upload video to cloudinary
    if (req.files && req.files.videoFile !== undefined) {
      const video = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = uploadDetails.duration;
    }

    // save data to DB
    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      data: updatedSection,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error("Error while updating the section");
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while updating the section",
    });
  }
};

// ================ Delete SubSection ================
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );

    // delete from DB
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // In frontned we have to take care - when subsection is deleted we are sending ,
    // only section data not full course details as we do in others

    // success response
    return res.json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,

      error: error.message,
      message: "An error occurred while deleting the SubSection",
    });
  }
};

const cloudinary = require("cloudinary").v2;

exports.uploadPDF = async (req, res) => {
  try {
    console.log("📂 Requête reçue pour upload !");

    if (!req.files || !req.files.pdf) {
      console.log("❌ Aucune donnée reçue !");
      return res
        .status(400)
        .json({ success: false, message: "Aucun fichier envoyé" });
    }

    const { subSectionId } = req.body;
    const pdfFile = req.files.pdf;

    console.log("📂 Fichier reçu :", pdfFile.name);
    console.log("📂 Type MIME :", pdfFile.mimetype);

    if (!pdfFile.mimetype.includes("pdf")) {
      console.log("❌ Format incorrect !");
      return res
        .status(400)
        .json({
          success: false,
          message: "Seuls les fichiers PDF sont autorisés !",
        });
    }

    // 🚀 Upload vers Cloudinary en tant que "raw" (fichier brut)
    console.log("🚀 Upload en cours...");
    const uploadResult = await cloudinary.uploader.upload(
      pdfFile.tempFilePath,
      {
        resource_type: "raw",
        folder: "EPBLearning/PDFs", // 📂 Stockage dans un dossier spécifique
        public_id: pdfFile.name.split(".")[0], // 🔍 Garde un nom de fichier unique
      }
    );

    if (!uploadResult.secure_url) {
      console.log("❌ Échec de l'upload Cloudinary !");
      return res
        .status(500)
        .json({ success: false, message: "Échec de l'upload" });
    }

    console.log("✅ Upload réussi :", uploadResult.secure_url);

    // 📂 Ajout du fichier dans la base de données
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      {
        $push: {
          resources: { name: pdfFile.name, url: uploadResult.secure_url },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedSubSection,
      message: "PDF téléversé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur dans l'upload :", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur" });
  }
};

exports.getPDFs = async (req, res) => {
  try {
    const { subSectionId } = req.params;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "Subsection not found" });
    }

    res.status(200).json({ success: true, resources: subSection.resources });
  } catch (error) {
    console.log("Error retrieving PDFs:", error);
    res.status(500).json({ success: false, message: "Error retrieving PDFs" });
  }
};

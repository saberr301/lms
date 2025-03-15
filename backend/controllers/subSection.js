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
      resources: [],
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

// ================ Add Resource to SubSection ================
exports.addResource = async (req, res) => {
  try {
    const { subSectionId, resourceTitle, resourceDescription, resourceType } =
      req.body;

    // Validation
    if (!subSectionId || !resourceTitle || !resourceType) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID, resource title and type are required",
      });
    }

    // Check for file
    if (!req.files || !req.files.resourceFile) {
      return res.status(400).json({
        success: false,
        message: "Resource file is required",
      });
    }

    // Find the subsection
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Upload the resource file to cloudinary
    const resourceFile = req.files.resourceFile;
    const uploadDetails = await uploadImageToCloudinary(
      resourceFile,
      `${process.env.FOLDER_NAME}/resources`
    );

    // Create resource object
    const newResource = {
      title: resourceTitle,
      description: resourceDescription || "",
      fileUrl: uploadDetails.secure_url,
      fileType: resourceType,
    };

    // Add to subsection resources
    subSection.resources.push(newResource);
    await subSection.save();

    // Return response
    return res.status(200).json({
      success: true,
      data: subSection,
      message: "Resource added successfully",
    });
  } catch (error) {
    console.error("Error adding resource to subsection");
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error adding resource to subsection",
    });
  }
};

// ================ Delete Resource from SubSection ================
exports.deleteResource = async (req, res) => {
  try {
    const { subSectionId, resourceId } = req.body;

    // Validation
    if (!subSectionId || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID and Resource ID are required",
      });
    }

    // Find the subsection and update
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      { $pull: { resources: { _id: resourceId } } },
      { new: true }
    );

    if (!updatedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      data: updatedSubSection,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting resource from subsection");
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error deleting resource from subsection",
    });
  }
};

// ================ Get Resources for SubSection ================
exports.getResources = async (req, res) => {
  try {
    const { subSectionId } = req.params;

    // Find the subsection
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Return resources
    return res.status(200).json({
      success: true,
      data: subSection.resources,
      message: "Resources fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching resources");
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error fetching resources",
    });
  }
};

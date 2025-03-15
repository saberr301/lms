const ForumMessage = require("../models/forumMessage");
const SubSection = require("../models/subSection");
const User = require("../models/user");

// Récupérer tous les messages d'une subsection
exports.getForumMessages = async (req, res) => {
  try {
    const { subsectionId } = req.params;

    // Vérification si la subsection existe
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "SubSection introuvable",
      });
    }

    // Récupération des messages principaux (pas les réponses)
    const messages = await ForumMessage.find({
      subSection: subsectionId,
      parentMessage: null,
    })
      .populate({
        path: "user",
        select: "firstName lastName image",
      })
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "firstName lastName image",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: messages,
      message: "Messages du forum récupérés avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des messages du forum:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des messages du forum",
      error: error.message,
    });
  }
};

// Créer un nouveau message
exports.createMessage = async (req, res) => {
  try {
    const { content, subsectionId, parentMessageId } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "Le contenu et l'ID de la subsection sont requis",
      });
    }

    // Vérification si la subsection existe
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "SubSection introuvable",
      });
    }

    const messageData = {
      content,
      subSection: subsectionId,
      user: userId,
      parentMessage: parentMessageId || null,
    };

    // Créer le message dans la DB
    const newMessage = await ForumMessage.create(messageData);

    // Si c'est une réponse, ajouter à la liste des réponses du message parent
    if (parentMessageId) {
      await ForumMessage.findByIdAndUpdate(
        parentMessageId,
        { $push: { replies: newMessage._id } },
        { new: true }
      );
    }

    // Populer les informations utilisateur pour la réponse
    const populatedMessage = await ForumMessage.findById(
      newMessage._id
    ).populate({
      path: "user",
      select: "firstName lastName image",
    });

    return res.status(201).json({
      success: true,
      data: populatedMessage,
      message: "Message créé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création du message:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du message",
      error: error.message,
    });
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Récupérer le message
    const message = await ForumMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message introuvable",
      });
    }

    // Vérifier si l'utilisateur est le propriétaire du message ou un admin
    if (
      message.user.toString() !== userId &&
      req.user.accountType !== "Admin" &&
      req.user.accountType !== "Instructor"
    ) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à supprimer ce message",
      });
    }

    // Si c'est un message parent, supprimer également toutes les réponses
    if (!message.parentMessage) {
      await ForumMessage.deleteMany({ parentMessage: messageId });
    } else {
      // Si c'est une réponse, la retirer de la liste des réponses du message parent
      await ForumMessage.findByIdAndUpdate(message.parentMessage, {
        $pull: { replies: messageId },
      });
    }

    // Supprimer le message
    await ForumMessage.findByIdAndDelete(messageId);

    return res.status(200).json({
      success: true,
      message: "Message supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du message",
      error: error.message,
    });
  }
};

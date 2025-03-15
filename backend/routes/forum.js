const express = require("express");
const router = express.Router();

const {
  getForumMessages,
  createMessage,
  deleteMessage,
} = require("../controllers/forum");

const { auth } = require("../middleware/auth");

// Récupérer les messages d'une subsection
router.get("/messages/:subsectionId", auth, getForumMessages);

// Créer un nouveau message
router.post("/message", auth, createMessage);

// Supprimer un message
router.delete("/message/:messageId", auth, deleteMessage);

module.exports = router;

// Mise à jour du fichier server.js pour inclure les routes du forum
// Ajouter après les autres routes:
// const forumRoutes = require('./routes/forum');
// app.use('/api/v1/forum', forumRoutes);

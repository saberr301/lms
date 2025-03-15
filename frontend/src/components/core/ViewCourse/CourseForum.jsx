import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchForumMessages,
  createForumMessage,
  resetForumState,
} from "../../../slices/forumSlice";
import ForumMessage from "./ForumMessage";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CourseForum = ({ subsectionId }) => {
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const { messages, status, error } = useSelector((state) => state.forum);

  useEffect(() => {
    // Récupérer les messages lors du chargement du composant
    if (subsectionId) {
      dispatch(fetchForumMessages(subsectionId));
    }

    // Nettoyer les messages lors du démontage du composant
    return () => {
      dispatch(resetForumState());
    };
  }, [dispatch, subsectionId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    dispatch(
      createForumMessage({
        content: newMessage,
        subsectionId,
        parentMessageId: null, // Message principal, pas une réponse
      })
    );

    setNewMessage("");
  };

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl font-bold text-richblack-5 mb-6">
        Forum de discussion
      </h2>

      {/* Formulaire pour créer un nouveau message */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message ici..."
          className="w-full p-3 bg-richblack-700 rounded-lg text-richblack-5 min-h-[120px]"
          required
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md flex items-center gap-2"
          >
            {status === "loading" ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Publier"
            )}
          </button>
        </div>
      </form>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-pink-100 text-pink-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Liste des messages */}
      {status === "loading" && messages.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <AiOutlineLoading3Quarters className="animate-spin text-yellow-50 text-2xl" />
        </div>
      ) : messages.length > 0 ? (
        <div>
          {messages.map((message) => (
            <ForumMessage
              key={message._id}
              message={message}
              subsectionId={subsectionId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-richblack-400 py-8">
          Aucun message dans cette discussion. Soyez le premier à poser une
          question !
        </p>
      )}
    </div>
  );
};

export default CourseForum;
// Mise à jour de VideoDetails.jsx
// Ajouter après les imports existants:
// import CourseForum from './CourseForum';
//
// Ajouter à la fin du composant, avant le return final:
// {/* Forum de discussion */}
// <CourseForum subsectionId={subSectionId} />

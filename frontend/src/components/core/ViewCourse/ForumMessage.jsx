import React, { useState } from "react";
import { FaReply, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createForumMessage,
  deleteForumMessage,
} from "../../../slices/forumSlice";

const ForumMessage = ({ message, subsectionId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Vérifier si l'utilisateur est autorisé à supprimer ce message
  const canDelete =
    user?.id === message.user._id ||
    user?.accountType === "Admin" ||
    user?.accountType === "Instructor";

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    dispatch(
      createForumMessage({
        content: replyContent,
        subsectionId,
        parentMessageId: message._id,
      })
    );

    setReplyContent("");
    setShowReplyForm(false);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      dispatch(deleteForumMessage(message._id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-richblack-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <img
          src={message.user.image}
          alt={`${message.user.firstName} ${message.user.lastName}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-richblack-5">
                {message.user.firstName} {message.user.lastName}
              </p>
              <p className="text-xs text-richblack-300">
                {formatDate(message.createdAt)}
              </p>
            </div>
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-pink-400 hover:text-pink-500"
              >
                <FaTrash />
              </button>
            )}
          </div>
          <p className="mt-2 text-richblack-100">{message.content}</p>

          <div className="mt-2">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-yellow-50 flex items-center gap-1 text-sm hover:text-yellow-100"
            >
              <FaReply /> Répondre
            </button>
          </div>

          {/* Formulaire de réponse */}
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                className="w-full p-2 bg-richblack-700 rounded-md text-richblack-5 min-h-[80px]"
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 bg-richblack-600 rounded-md text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-yellow-50 text-richblack-900 rounded-md text-sm"
                >
                  Envoyer
                </button>
              </div>
            </form>
          )}

          {/* Afficher les réponses */}
          {message.replies && message.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-richblack-700">
              {message.replies.map((reply) => (
                <div key={reply._id} className="mb-3">
                  <div className="flex items-start gap-2">
                    <img
                      src={reply.user.image}
                      alt={`${reply.user.firstName} ${reply.user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-richblack-5 text-sm">
                            {reply.user.firstName} {reply.user.lastName}
                          </p>
                          <p className="text-xs text-richblack-300">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                        {(user?.id === reply.user._id ||
                          user?.accountType === "Admin" ||
                          user?.accountType === "Instructor") && (
                          <button
                            onClick={() =>
                              dispatch(deleteForumMessage(reply._id))
                            }
                            className="text-pink-400 hover:text-pink-500"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-richblack-100 text-sm">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumMessage;

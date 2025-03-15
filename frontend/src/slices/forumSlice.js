import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiConnector } from "../services/apiConnector";
import { forumEndpoints } from "../services/apis";

// Async Thunks
export const fetchForumMessages = createAsyncThunk(
  "forum/fetchMessages",
  async (subsectionId, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "GET",
        forumEndpoints.GET_MESSAGES_API + `/${subsectionId}`,
        null,
        {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createForumMessage = createAsyncThunk(
  "forum/createMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "POST",
        forumEndpoints.CREATE_MESSAGE_API,
        messageData,
        {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteForumMessage = createAsyncThunk(
  "forum/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "DELETE",
        forumEndpoints.DELETE_MESSAGE_API + `/${messageId}`,
        null,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      );
      return { messageId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  messages: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    resetForumState: (state) => {
      state.messages = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchForumMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchForumMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload.data;
      })
      .addCase(fetchForumMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message ||
          "Erreur lors de la récupération des messages";
      })
      // Create Message
      .addCase(createForumMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createForumMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Si c'est un message parent, l'ajouter au début de la liste
        if (!action.payload.data.parentMessage) {
          state.messages = [action.payload.data, ...state.messages];
        } else {
          // Si c'est une réponse, l'ajouter aux réponses du message parent
          const parentIndex = state.messages.findIndex(
            (message) => message._id === action.payload.data.parentMessage
          );
          if (parentIndex !== -1) {
            if (!state.messages[parentIndex].replies) {
              state.messages[parentIndex].replies = [];
            }
            state.messages[parentIndex].replies.push(action.payload.data);
          }
        }
      })
      .addCase(createForumMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Erreur lors de la création du message";
      })
      // Delete Message
      .addCase(deleteForumMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteForumMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Supprimer le message de la liste
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload.messageId
        );
      })
      .addCase(deleteForumMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Erreur lors de la suppression du message";
      });
  },
});

export const { resetForumState } = forumSlice.actions;

export default forumSlice.reducer;

// Mise à jour du fichier services/apis.js pour inclure les endpoints du forum
// Ajouter à la fin du fichier:
// export const forumEndpoints = {
//   GET_MESSAGES_API: BASE_URL + '/api/v1/forum/messages',
//   CREATE_MESSAGE_API: BASE_URL + '/api/v1/forum/message',
//   DELETE_MESSAGE_API: BASE_URL + '/api/v1/forum/message',
// };

// Mise à jour du fichier redux/reducer/index.js pour inclure le reducer du forum
// import forumReducer from "../slices/forumSlice";
//
// const rootReducer = combineReducers({
//   auth: authReducer,
//   profile: profileReducer,
//   course: courseReducer,
//   cart: cartReducer,
//   viewCourse: viewCourseReducer,
//   sidebar: sidebarSlice,
//   forum: forumReducer, // Ajouter cette ligne
// });

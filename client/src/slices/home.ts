import { createSlice } from "@reduxjs/toolkit";
import { Message, OnlineStatus, Reaction } from "../generated/graphql";
import { HomeState, SelectedUser } from "../types";

const initialState: HomeState = {
  currentUser: null,
  users: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setListUsers: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, { payload }: { payload: SelectedUser }) => {
      state.users = state.users.map((u) => {
        return u.id === payload.id
          ? {
              ...u,
              messages: payload.messages,
            }
          : u;
      });
    },
    setActiveStatus: (state, { payload }: { payload: OnlineStatus }) => {
      state.users = state.users.map((u) => {
        return u.id === payload.userId
          ? { ...u, isOnline: payload.isOnline }
          : u;
      });
    },
    setMessages: (state, { payload }: { payload: Message }) => {
      const { from, to, content } = payload;
      state.users = state.users.map((u) => {
        return u.id === from || u.id === to
          ? {
              ...u,
              messages: [...(u.messages || []), payload],
              latestMessage: content,
            }
          : u;
      });
    },
    addReaction: (state, { payload }: { payload: Reaction }) => {
      const { message, messageId, userId } = payload;
      const userIndex = state.users.findIndex(
        (u) => u.id === message.from || u.id === message.to
      );
      let userCopy = state.users[userIndex];

      userCopy.messages = userCopy?.messages?.map((m) => {
        if (m.id === messageId) {
          const reactionIndex = (m.reactions || []).findIndex(
            (r) => r.userId === userId
          );
          if (reactionIndex === -1) {
            return { ...m, reactions: [...(m.reactions || []), payload] };
          } else {
            let reactionCopy = m.reactions;
            reactionCopy[reactionIndex] = payload;
            return { ...m, reactions: reactionCopy };
          }
        }
        return m;
      });
    },
  },
});

export const {
  setListUsers,
  setCurrentUser,
  setSelectedUser,
  setMessages,
  setActiveStatus,
  addReaction,
} = homeSlice.actions;
export default homeSlice.reducer;

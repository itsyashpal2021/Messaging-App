import { combineReducers, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userData",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      state.username = user.username;
      state.firstName = user.firstName;
      state.lastName = user.lastName;
      state.email = user.email;
      state.profilePic = user.profilePic;
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
  },
});

export const friendDataSlice = createSlice({
  name: "friendData",
  initialState: {},
  reducers: {
    setFriendData: (state, action) => {
      state.friendList = action.payload.friendList;
      state.friendRequestsSent = action.payload.friendRequestsSent;
      state.friendRequestsRecieved = action.payload.friendRequestsRecieved;
    },

    setFriendList: (state, action) => {
      state.friendList = action.payload;
    },

    addToFriendRequestsRecieved: (state, action) => {
      const newList = state.friendRequestsRecieved;
      state.friendRequestsRecieved = [...newList, action.payload];
    },

    removeFromFriendRequestsRecieved: (state, action) => {
      let newList = state.friendRequestsRecieved;
      newList = newList.filter(
        (request) => request.username !== action.payload
      );
      state.friendRequestsRecieved = newList;
    },

    addToFriendRequestsSent: (state, action) => {
      const newList = state.friendRequestsSent;
      state.friendRequestsSent = [...newList, action.payload];
    },

    removeFromFriendRequestsSent: (state, action) => {
      let newList = state.friendRequestsSent;
      newList = newList.filter((username) => username !== action.payload);
      state.friendRequestsSent = newList;
    },

    addToFriendList: (state, action) => {
      let newFriendList = state.friendList;
      newFriendList = [action.payload, ...newFriendList];
      state.friendList = newFriendList;
    },

    removeFromFriendList: (state, action) => {
      let newFriendList = state.friendList;
      newFriendList = newFriendList.filter(
        (friend) => friend.username !== action.payload
      );
      state.friendList = newFriendList;
    },
  },
});

export const activeChatSlice = createSlice({
  name: "activeChat",
  initialState: {},
  reducers: {
    setActiveChat: (state, action) => {
      state.username = action.payload.username;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
    },
  },
});

export const chatDataSlice = createSlice({
  name: "chatData",
  initialState: {},
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const { friend, message } = action.payload;
      state.messages[friend].push(message);
    },
    clearChat: (state, action) => {
      delete state.messages[action.payload];
    },
    newChat: (state, action) => {
      state.messages[action.payload] = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setProfilePic } = userSlice.actions;

export const {
  setFriendData,
  setFriendList,
  addToFriendRequestsRecieved,
  removeFromFriendRequestsRecieved,
  addToFriendRequestsSent,
  removeFromFriendRequestsSent,
  addToFriendList,
  removeFromFriendList,
} = friendDataSlice.actions;

export const { setActiveChat, addToMessages } = activeChatSlice.actions;

export const { setMessages, addMessage, clearChat, newChat } =
  chatDataSlice.actions;

export default combineReducers({
  userData: userSlice.reducer,
  friendData: friendDataSlice.reducer,
  activeChat: activeChatSlice.reducer,
  chatData: chatDataSlice.reducer,
});

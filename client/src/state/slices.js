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
    },
  },
});

export const friendDataSlice = createSlice({
  name: "friendData",
  initialState: {
    friendList: [],
    friendRequestsRecieved: [],
    friendRequestsSent: [],
  },
  reducers: {
    setFriendData: (state, action) => {
      state.friendList = action.payload.friendList;
      state.friendRequestsSent = action.payload.friendRequestsSent;
      state.friendRequestsRecieved = action.payload.friendRequestsRecieved;
    },
    setFriendList: (state, action) => {
      state.friendList = action.payload;
    },
    updateLastMessage: (state, action) => {
      const newFriendList = JSON.parse(JSON.stringify(state.friendList));
      const ind = newFriendList.findIndex(
        (friend) => friend.username === action.payload.username
      );

      if (ind === -1) {
        console.error("Friend not found in friendList.");
        return;
      }

      newFriendList[ind].lastMessage = action.payload.lastMessage;
      newFriendList[ind].lastMessageTime = action.payload.lastMessageTime;

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
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;
export const { setFriendData, setFriendList, updateLastMessage } =
  friendDataSlice.actions;
export const { setActiveChat } = activeChatSlice.actions;

export default combineReducers({
  userData: userSlice.reducer,
  friendData: friendDataSlice.reducer,
  activeChat: activeChatSlice.reducer,
});

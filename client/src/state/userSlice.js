import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      state.username = user.username;
      state.firstName = user.firstName;
      state.lastName = user.lastName;
      state.email = user.email;
      state.friendList = user.friendList;
      state.friendRequestsRecieved = user.friendRequestsRecieved;
      state.friendRequestsSent = user.friendRequestsSent;
      state.messages = user.messages;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;

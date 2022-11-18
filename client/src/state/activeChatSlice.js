import { createSlice } from "@reduxjs/toolkit";

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
export const { setActiveChat } = activeChatSlice.actions;

export default activeChatSlice.reducer;

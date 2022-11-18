import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import activeChatReducer from "./activeChatSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    activeChat: activeChatReducer,
  },
});

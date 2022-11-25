import { configureStore } from "@reduxjs/toolkit";
import reducers from "./slices.js";

export default configureStore({
  reducer: reducers,
});

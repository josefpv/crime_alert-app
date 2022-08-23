import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counterSlice";
import mapState from "./features/mapState";

export default configureStore({
  reducer: {
    counter: counterSlice,
    mapState: mapState,
  },
});

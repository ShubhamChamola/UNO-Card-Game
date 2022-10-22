import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import gameReducer from "./Slices/gameSlice";

const store = configureStore({
  reducer: {
    authState: authReducer,
    gameState: gameReducer,
  },
});

export default store;

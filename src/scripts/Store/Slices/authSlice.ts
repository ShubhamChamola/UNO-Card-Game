import { createSlice } from "@reduxjs/toolkit";

type authState = {
  loggedIn: boolean;
  uid: string | null;
  userName: string | null;
  email: string | null;
  points: number;
};

const initialState: authState = {
  loggedIn: false,
  uid: null,
  userName: null,
  email: null,
  points: 0,
};

export const authSlice = createSlice({
  name: "auth_state",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.loggedIn = true;
      state.userName = action.payload.userName;
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.points = action.payload.points;
    },

    resetUserInfo(state) {
      state.loggedIn = false;
      state.userName = null;
      state.uid = null;
      state.email = null;
      state.points = 0;
    },
  },
});

// All possible actions for reduce funtion
export const { setUserInfo, resetUserInfo } = authSlice.actions;

export default authSlice.reducer;

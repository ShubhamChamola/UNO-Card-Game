import { createSlice } from "@reduxjs/toolkit";

type gameState = {
  lobbyID: string | null;
  serverID: string | null;
  playersCapacity: number;
  joined: number;
  playersInfo: { id: string; name: string; points: number }[];
};

const initialState: gameState = {
  lobbyID: null,
  serverID: null,
  playersCapacity: 0,
  joined: 0,
  playersInfo: [],
};

export const gameSlice = createSlice({
  name: "game_state",
  initialState,
  reducers: {
    initialSetUp(state, action) {
      state.lobbyID = action.payload.lobbyID;
      state.serverID = action.payload.serverID;
      state.playersCapacity = action.payload.playersCapacity;
    },

    updateJoinedCount(state, action) {
      state.joined = action.payload;
    },

    setPlayersInfo(state, action) {
      state.playersInfo = action.payload;
    },

    resetGameState(state) {
      state.lobbyID = null;
      state.serverID = null;
      state.playersCapacity = 0;
      state.joined = 0;
      state.playersInfo = [];
    },
  },
});

// All possible actions for reduce funtion
export const {
  resetGameState,
  initialSetUp,
  updateJoinedCount,
  setPlayersInfo,
} = gameSlice.actions;

export default gameSlice.reducer;

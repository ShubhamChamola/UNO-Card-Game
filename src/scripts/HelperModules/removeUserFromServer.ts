import store from "../Store/store";
import { runTransaction, ref, set, push, get, off } from "firebase/database";
import { realtimeDB } from "../firebase.config";
import { gameSlice } from "../Store/Slices/gameSlice";

async function removeUserFromServer() {
  let serverData = store.getState().gameState;
  let shouldServerBeClosed = false;

  const result = await runTransaction(
    ref(realtimeDB, `servers/${serverData.serverID}/`),
    (serverInfo) => {
      if (serverInfo) {
        serverInfo.joined--;
        if (serverInfo.joined == 0) {
          shouldServerBeClosed = true;
        } else {
          shouldServerBeClosed = false;
        }
      }
      return serverInfo;
    }
  );

  if (!result.committed) {
    throw new Error(
      "unable to delete user data from the current joined server. Please report the issue"
    );
  } else {
    if (shouldServerBeClosed) {
      console.log("server deleted");
      set(ref(realtimeDB, `servers/${serverData.serverID}`), {}).then(() => {
        off(ref(realtimeDB, `servers/${serverData.serverID}/joined`));
        off(ref(realtimeDB, `servers/${serverData.serverID}/players`));
        store.dispatch(gameSlice.actions.resetGameState());
      });
    } else {
      set(
        ref(
          realtimeDB,
          `servers/${serverData.serverID}/players/${serverData.lobbyID}`
        ),
        {}
      ).then(() => {
        off(ref(realtimeDB, `servers/${serverData.serverID}/joined`));
        off(ref(realtimeDB, `servers/${serverData.serverID}/players`));
        store.dispatch(gameSlice.actions.resetGameState());
      });
    }
  }
}

export default removeUserFromServer;

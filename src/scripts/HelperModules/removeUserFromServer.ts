import store from "../Store/store";
import { runTransaction, ref, set, push, get } from "firebase/database";
import { realtimeDB } from "../firebase.config";
import { gameSlice } from "../Store/Slices/gameSlice";

async function removeUserFromServer() {
  let serverData = store.getState().gameState;
  let shouldServerBeClosed = false;

  // I dont know why but when i get the data of the server from realtimeDB then only the transaction will work for the joined player else it will throw an error
  const receivedDoc = await get(
    ref(realtimeDB, `servers/${serverData.serverID}`)
  );

  const result = await runTransaction(
    ref(realtimeDB, `servers/${serverData.serverID}`),
    (serverInfo) => {
      if (serverInfo) {
        serverInfo.joined--;
        if (serverInfo.joined == 0) {
          shouldServerBeClosed = true;
        }
        return serverInfo;
      }
    }
  );

  if (!result.committed) {
    throw new Error(
      "unable to delete user data from the current joined server. Please report the issue"
    );
  } else {
    if (shouldServerBeClosed) {
      set(ref(realtimeDB, `servers/${serverData.serverID}`), {});
    } else {
      set(
        ref(
          realtimeDB,
          `servers/${serverData.serverID}/players/${serverData.lobbyID}`
        ),
        {}
      );
    }

    store.dispatch(gameSlice.actions.resetGameState());
  }
}

export default removeUserFromServer;

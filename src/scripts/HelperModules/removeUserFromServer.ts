import store from "../Store/store";
import { runTransaction, ref, set, push, get, off } from "firebase/database";
import { realtimeDB } from "../firebase.config";
import { gameSlice } from "../Store/Slices/gameSlice";

async function removeUserFromServer() {
  let serverData = store.getState().gameState;
  let shouldServerBeClosed = false;

  off(ref(realtimeDB, `servers/${serverData.serverID}/joined`));
  off(ref(realtimeDB, `servers/${serverData.serverID}/players`));

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

  document.querySelector(".lobby")?.remove();

  document.fullscreenElement && document.exitFullscreen();

  if (!result.committed) {
    throw new Error(
      "unable to delete user data from the current joined server. Please report the issue"
    );
  } else {
    document.querySelector(".lobby")?.remove();
    if (shouldServerBeClosed) {
      console.log("server deleted");
      set(ref(realtimeDB, `servers/${serverData.serverID}`), {}).then(() => {
        store.dispatch(gameSlice.actions.resetGameState());
      });
    } else {
      get(ref(realtimeDB, `cards/${serverData.serverID}`)).then((snapshot) => {
        let unFlippedCards = snapshot.val().unFlippedCards;
        // let playerCards = snapshot.val().["pl"]
        set(
          ref(realtimeDB, `cards/${serverData.serverID}/${serverData.lobbyID}`),
          {}
        );
      });
      set(
        ref(
          realtimeDB,
          `servers/${serverData.serverID}/players/${serverData.lobbyID}`
        ),
        {}
      ).then(() => {
        store.dispatch(gameSlice.actions.resetGameState());
      });
    }
  }
}

export default removeUserFromServer;

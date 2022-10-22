import homeObject from "./home";
import store from "../Store/store";
import changeDisplayProp from "../HelperModules/changeDisplayProp";
import { off, ref } from "firebase/database";
import { realtimeDB } from "../firebase.config";
import removeUserFromServer from "../HelperModules/removeUserFromServer";

let isGameLobbyFetched = false;

// ***
// Events for switching between server broswer and custom server
homeObject.createServerBtn?.addEventListener("click", () => {
  changeDisplayProp(homeObject.joinServerPanel, "hide");
  changeDisplayProp(homeObject.customServerPanel, "show");
});

homeObject.backBtn?.addEventListener("click", () => {
  changeDisplayProp(homeObject.joinServerPanel, "show");
  changeDisplayProp(homeObject.customServerPanel, "hide");
});
// ----------------------------------------------

// ***
// Events for display prop of home page
const homeDOMManipulation = () => {
  let { loggedIn } = store.getState().authState;
  if (loggedIn) {
    changeDisplayProp(homeObject.homeSection, "show");
  } else {
    changeDisplayProp(homeObject.homeSection, "hide");
  }
};
// -----------------------------------------------

// ***
// Event for server name input field
homeObject.serverNameInput.addEventListener("change", () => {
  homeObject.checkInput();
});
// -----------------------------------------------

// ***
// Event on create server form button click
homeObject.customServerBtn.addEventListener("click", (event) => {
  event.preventDefault();
  homeObject.createServer();
});
// -----------------------------------------------

// ***
// Event triggered when user join a server for waiting pannel
function WaitingPannelManipulation() {
  let serverData = store.getState().gameState;
  if (serverData.serverID) {
    !homeObject.customServerPanel.classList.contains("display-none") &&
      changeDisplayProp(homeObject.customServerPanel, "hide");
    !homeObject.joinServerPanel.classList.contains("display-none") &&
      changeDisplayProp(homeObject.joinServerPanel, "hide");
    changeDisplayProp(homeObject.waitingPanel, "show");
  }
}
// -----------------------------------------------

// ***
// Event on cancel button in the waitting pannel
homeObject.quitLobbyBtn.addEventListener("click", () => {
  if (store.getState().gameState.serverID) {
    off(
      ref(realtimeDB, `servers/${store.getState().gameState.serverID}/joined`)
    );
  }

  homeObject.fetchServerList();

  changeDisplayProp(homeObject.waitingPanel, "hide");
  changeDisplayProp(homeObject.joinServerPanel, "show");

  removeUserFromServer();
});
// ------------------------------------------------

// ***
// Function responsible for importing lobbyObject when game initiate
async function fetchGameLobby() {
  try {
    let serverInfo = store.getState().gameState;
    if (
      serverInfo.joined! == serverInfo.playersCapacity! &&
      !isGameLobbyFetched
    ) {
      await import("../GameLobby/gameLobby");
      isGameLobbyFetched = true;
      console.log("game lobby fetched");
    }
  } catch (error: any) {
    console.log(error.code, error.message);
  }
}

// ***
// Store subscribe
store.subscribe(homeDOMManipulation);
store.subscribe(WaitingPannelManipulation);
store.subscribe(fetchGameLobby);
// ------------------------------------------------

export default "";

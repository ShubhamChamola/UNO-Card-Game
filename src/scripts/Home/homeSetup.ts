import homeObject from "./home";
import store from "../Store/store";
import changeDisplayProp from "../HelperModules/changeDisplayProp";
import removeUserFromServer from "../HelperModules/removeUserFromServer";

let isGameLobbyFetched = false;
let isWaitingPannelShown = false;
let isGameLobbyShown = false;
let isJoiningServerPanelShown = true;

// ***
// Events for switching between server broswer and custom server
homeObject.createServerBtn?.addEventListener("click", () => {
  changeDisplayProp(homeObject.joinServerPanel, "hide");
  isJoiningServerPanelShown = false;
  changeDisplayProp(homeObject.customServerPanel, "show");
});

homeObject.backBtn?.addEventListener("click", () => {
  changeDisplayProp(homeObject.joinServerPanel, "show");
  isJoiningServerPanelShown = true;
  changeDisplayProp(homeObject.customServerPanel, "hide");
});
// ----------------------------------------------

// ***
// Events for display prop of home page
const homeDOMManipulation = async () => {
  try {
    let { loggedIn } = store.getState().authState;
    let serverInfo = store.getState().gameState;
    if (loggedIn && !isGameLobbyShown) {
      changeDisplayProp(homeObject.homeSection, "show");
    } else {
      changeDisplayProp(homeObject.homeSection, "hide");
    }

    if (
      !serverInfo.serverID &&
      serverInfo.joined == serverInfo.playersCapacity &&
      serverInfo.joined == 0 &&
      isGameLobbyShown
    ) {
      changeDisplayProp(document.querySelector(".lobby"), "hide");
      isGameLobbyShown = false;
      changeDisplayProp(homeObject.homeSection, "show");
      changeDisplayProp(homeObject.joinServerPanel, "show");
      isJoiningServerPanelShown = true;
      homeObject.fetchServerList();
    } else if (
      !serverInfo.serverID &&
      serverInfo.joined == serverInfo.playersCapacity &&
      serverInfo.joined == 0 &&
      !isGameLobbyShown &&
      !isJoiningServerPanelShown
    ) {
      changeDisplayProp(homeObject.joinServerPanel, "show");
      isJoiningServerPanelShown = true;
      homeObject.fetchServerList();
    }
    fetchGameLobby();
    WaitingPannelManipulation();
  } catch (error: any) {
    console.log(error.code, error.message);
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
  if (
    serverData.serverID &&
    serverData.joined > 0 &&
    serverData.joined != serverData.playersCapacity &&
    !isWaitingPannelShown &&
    !isGameLobbyShown
  ) {
    !homeObject.customServerPanel.classList.contains("display-none") &&
      changeDisplayProp(homeObject.customServerPanel, "hide");
    !homeObject.joinServerPanel.classList.contains("display-none") &&
      changeDisplayProp(homeObject.joinServerPanel, "hide");
    changeDisplayProp(homeObject.waitingPanel, "show");
    isWaitingPannelShown = true;
    isJoiningServerPanelShown = false;
  } else if (
    serverData.serverID &&
    serverData.joined > 0 &&
    serverData.joined == serverData.playersCapacity &&
    isWaitingPannelShown
  ) {
    changeDisplayProp(homeObject.waitingPanel, "hide");
    isWaitingPannelShown = false;
  } else if (
    !serverData.serverID &&
    serverData.joined == 0 &&
    isWaitingPannelShown
  ) {
    changeDisplayProp(homeObject.waitingPanel, "hide");
    isWaitingPannelShown = false;
  }
}
// -----------------------------------------------

// ***
// Event on cancel button when user joins a server
homeObject.quitLobbyBtn.addEventListener("click", () => {
  removeUserFromServer();
});
// ------------------------------------------------

// ***
// Function responsible for importing lobbyObject when game initiate
async function fetchGameLobby() {
  try {
    let serverInfo = store.getState().gameState;
    if (
      serverInfo.joined == serverInfo.playersCapacity &&
      serverInfo.joined != 0 &&
      !isGameLobbyFetched &&
      !isGameLobbyShown
    ) {
      isGameLobbyFetched = true;
      isGameLobbyShown = true;
      await import("../Lobby/lobbySetup");
      console.log("game lobby fetched");
      changeDisplayProp(homeObject.homeSection, "hide");
    } else if (
      serverInfo.joined == serverInfo.playersCapacity &&
      serverInfo.joined != 0 &&
      !isGameLobbyShown &&
      isGameLobbyFetched
    ) {
      isGameLobbyShown = true;
      changeDisplayProp(homeObject.homeSection, "hide");
      changeDisplayProp(document.querySelector(".lobby"), "show");
    }
  } catch (error: any) {
    console.log(error.code, error.message);
  }
}

// ***
// Store subscribe
store.subscribe(homeDOMManipulation);
// ------------------------------------------------

export default "";

import { navigationObject } from "./nav";
import store from "../Store/store";
import { auth } from "../firebase.config";
import removeUserFromServer from "../HelperModules/removeUserFromServer";

let isLoggedOutConstructed = false;
let isLoggedInConstructed = false;
let isLobbyConstructed = false;

// ***
// Nav change according to auth state
const navModify = function () {
  let { loggedIn, userName, points } = store.getState().authState;
  let { joined } = store.getState().gameState;
  if (!isLobbyConstructed && joined > 0) {
    navigationObject.lobbyConstructor();
    document.querySelector(".exit img")?.addEventListener("click", () => {
      removeUserFromServer();
    });
    isLobbyConstructed = true;
    isLoggedInConstructed = false;
    isLoggedOutConstructed = false;
  } else if (loggedIn && !isLoggedInConstructed && joined == 0) {
    navigationObject.loggedInConstructor(userName!, points);
    navigationObject.logoutButton?.addEventListener("click", () => {
      auth.signOut();
    });
    isLobbyConstructed = false;
    isLoggedInConstructed = true;
    isLoggedOutConstructed = false;
  } else if (!loggedIn && !isLoggedOutConstructed) {
    navigationObject.loggedOutContructor();
    isLobbyConstructed = false;
    isLoggedInConstructed = false;
    isLoggedOutConstructed = true;
  }
};
// ------------------------------------------

store.subscribe(navModify);
// -----------------------------------------

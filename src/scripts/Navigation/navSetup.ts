import { navigationObject } from "./nav";
import store from "../Store/store";
import { auth } from "../firebase.config";

// ***
// Nav change according to auth state
const navModify = function () {
  let { loggedIn, userName, points } = store.getState().authState;
  if (loggedIn) {
    navigationObject.loggedInConstructor(userName!, points);
    navigationObject.logoutButton?.addEventListener("click", () => {
      auth.signOut();
    });
  } else {
    navigationObject.loggedOutContructor();
  }
};

store.subscribe(navModify);
// -----------------------------------------

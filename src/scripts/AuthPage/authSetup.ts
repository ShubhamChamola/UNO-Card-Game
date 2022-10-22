import { authObject } from "./auth";
import store from "../Store/store";
import changeDisplayProp from "../HelperModules/changeDisplayProp";

// ***
// On click of JOIN NOW btn
authObject.alternateModeButton.addEventListener("click", () => {
  if (authObject.alternateModeButton.textContent == "JOIN NOW") {
    authObject.signUpConstruct();
  } else {
    authObject.signInConstruct();
  }
});
// ---------------------------------------------

// ***
// Form Input handler
authObject.emailInput.addEventListener("change", () => {
  authObject.checkEmailInput();
});
authObject.passwordInput.addEventListener("change", () => {
  authObject.checkPasswordInput();
});
// ---------------------------------------------

// ***
// form Button Hanlder
authObject.formButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (authObject.formButton.innerText == "LOGIN") {
    authObject.signInHandler();
  } else {
    authObject.signUpHandler();
  }
});
// ----------------------------------------------

// ***
// Guest singin event
authObject.guestButton.addEventListener("click", () => {
  authObject.guestSignIn();
});
// ----------------------------------------------

// ***
// Google singin event
authObject.googleButton.addEventListener("click", () => {
  authObject.googleSignIn();
});
// ----------------------------------------------

// ***
// Event for displaying authPage
const authDomManipulation = function () {
  let { loggedIn } = store.getState().authState;
  if (loggedIn) {
    changeDisplayProp(authObject.authSection, "hide");
  } else {
    changeDisplayProp(authObject.authSection, "show");
  }
};
// ----------------------------------------------

store.subscribe(authDomManipulation);
// -----------------------------------------------
export default "";

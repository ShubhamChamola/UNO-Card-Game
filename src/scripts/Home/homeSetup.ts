import homeObject from "./home";
import store from "../Store/store";
import changeDisplayProp from "../HelperFunctions/changeDisplayProp";

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
// Store subscribe
store.subscribe(homeDOMManipulation);
// ------------------------------------------------

export default "";

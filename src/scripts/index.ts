import "../styles/main.scss";
import { auth, db } from "./firebase.config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Navigation/navSetup";
import store from "./Store/store";
import { setUserInfo, resetUserInfo } from "./Store/Slices/authSlice";

type signUpResponse = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type userInfo = {
  uid: string;
  userName: string;
  email: string | null;
  points: number;
};

let isAuthFetched = false;
let isHomeFetched = false;

// ***
// State Observer for auth state of user
onAuthStateChanged(auth, async (user) => {
  if (user) {
    let userInfo: userInfo;
    if (!sessionStorage.userInfo) {
      userInfo = (await saveUserInfo(user))!;
    } else {
      console.log("Taken from session storage");
      userInfo = JSON.parse(sessionStorage.userInfo);
    }
    store.dispatch(setUserInfo({ ...userInfo, loggedIn: true }));

    // Home Initialization
    !isHomeFetched && fetchHome();
  } else {
    store.dispatch(resetUserInfo());
    sessionStorage.removeItem("userInfo");

    // Auth Initialization
    !isAuthFetched && fetchAuth();
  }
});
// --------------------------------------------

// ***
// AuthHandler
const fetchAuth = async () => {
  try {
    await import("./AuthPage/authSetup");
    isAuthFetched = true;
  } catch (error) {
    console.log(error);
  }
};
// --------------------------------------------

// ***
// HomeHandler
const fetchHome = async () => {
  try {
    await import("./Home/homeSetup");
    isHomeFetched = true;
  } catch (error) {
    console.log(error);
  }
};
// --------------------------------------------

// ***
// upload new userInfo
const constructUserName = function (
  uid: string,
  email: string | null,
  displayName: string | null
): string {
  if (displayName) {
    let spc = displayName.indexOf(" ");
    let str = displayName.slice(0, typeof spc === "number" ? spc : 5);
    let strUID = uid.slice(0, 5);
    return str + "#" + strUID;
  } else if (email) {
    let str = email.slice(0, 5);
    let strUID = uid.slice(0, 5);
    return str + "#" + strUID;
  } else {
    let strUID = uid.slice(0, 5);
    return "guest" + "#" + strUID;
  }
};

const saveUserInfo = async function (
  info: signUpResponse
): Promise<userInfo | void> {
  try {
    let userInfo: userInfo;
    const docSnap = await getDoc(doc(db, "users", info.uid));
    if (docSnap.exists()) {
      console.log("existing user");
      userInfo = docSnap.data() as userInfo;
    } else {
      let data: userInfo = {
        userName: constructUserName(info.uid, info.email, info.displayName),
        email: info.email,
        uid: info.uid,
        points: 0,
      };
      await setDoc(doc(db, "users", info.uid), {
        ...data,
        points: 0,
      });
      console.log("new user");
      userInfo = data;
    }
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    return userInfo;
  } catch (error: any) {
    console.log(error.message, error.code);
  }
};
// --------------------------------------------

const displayStore = () => {
  console.log(store.getState());
};

store.subscribe(displayStore);

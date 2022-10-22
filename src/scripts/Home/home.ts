import "./home.scss";
import createCustomElement from "../HelperModules/createCustomElement";
import {
  ref,
  set,
  push,
  onValue,
  query,
  equalTo,
  orderByChild,
  runTransaction,
  off,
} from "firebase/database";
import { realtimeDB } from "../firebase.config";
import store from "../Store/store";
import { gameSlice } from "../Store/Slices/gameSlice";

const heroImg = require("../../assets/hero-img-without-bg.png").default;
const backArrowIcon = require("../../assets/back-arrow-icon.png").default;
const errorModalCloseIcon =
  require("../../assets/error-modal-close-icon.png").default;

type serverInfo = {
  serverName: string;
  joined: string;
  serverID: string;
  playersCapacity: string;
};

class Home {
  private static root: HTMLElement = document.querySelector("#root")!;
  private static errorModal = document.querySelector(
    "#error-modal"
  )! as HTMLElement;
  private static serverNameSuggestionCount = 0;
  private static creatingServerErrorCount = 0;
  private static joiningServerErrorCount = 0;
  rightContainer: HTMLElement;
  homeSection: HTMLElement;
  createServerBtn: HTMLElement;
  joinServerPanel: HTMLElement;
  customServerPanel: HTMLElement;
  waitingPanel: HTMLElement;
  backBtn: HTMLElement;
  serverNameInput: HTMLInputElement;
  customServerBtn: HTMLButtonElement;
  quitLobbyBtn: HTMLElement;

  constructor() {
    Home.constructLayout();
    this.rightContainer = document.querySelector(".right-side")!;
    this.homeSection = document.querySelector(".home")!;
    this.constructServerBrowserLayout();
    this.constructCustomServerLayout();
    this.constructWaitingLayout();
    this.serverNameInput = document.querySelector("#server-name")!;
    this.customServerBtn = document.querySelector("#server-form button")!;
    this.createServerBtn = document.querySelector(".create-server button")!;
    this.joinServerPanel = document.querySelector(".join-server")!;
    this.customServerPanel = document.querySelector(".custom-server")!;
    this.waitingPanel = document.querySelector(".waiting-pannel")!;
    this.backBtn = document.querySelector(".back-icon")!;
    this.quitLobbyBtn = document.querySelector(".waiting-pannel button")!;
  }

  private static constructLayout() {
    let addedElelementInnerHtml = ` <div class="left-side">
        <img src="${heroImg}" alt="uno cards image">
      </div>
      <div class="right-side"></div>`;

    createCustomElement(
      Home.root,
      "section",
      ["home"],
      addedElelementInnerHtml
    );
  }

  private constructServerBrowserLayout() {
    let addedElementInnerHtml = `
    <h3>Server Browser</h3>
    <div class="create-server">
      <p>Create Your Own Server</p>
      <button>Create</button>
    </div>
    <div class="server-list">
      <h4>Server List</h4>
      <div class="server-list-container">
        <ul>
        </ul>
      </div>
    </div>
    `;

    createCustomElement(
      this.rightContainer,
      "div",
      ["container", "join-server"],
      addedElementInnerHtml
    );

    this.fetchServerList();
  }

  fetchServerList() {
    try {
      let list: serverInfo[] = [];

      onValue(
        query(ref(realtimeDB, "servers/"), orderByChild("open"), equalTo(true)),
        (snapshot) => {
          list = [];
          if (snapshot.exists()) {
            for (const [key, value] of Object.entries(snapshot.val())) {
              list.push(value as any);
            }
          }
          this.displayServerList(list);
        }
      );
    } catch (error: any) {
      console.log(error.code, error.message);
    }
  }

  private displayServerList(list: serverInfo[]) {
    let listElement = document.querySelector(
      ".server-list-container ul"
    )! as HTMLElement;

    if (list.length >= 1) {
      listElement.innerHTML = list
        .map(
          (item) => `
        <li class="server-info">
          <h5>${item.serverName}</h5>
          <span>${item.joined}/${item.playersCapacity}</span>
          <button id=${item.serverID}>Join</button>
        </li>
        `
        )
        .join("\n");
      const listOFServerElementBtns = document.querySelectorAll(
        ".server-info button"
      )!;

      listOFServerElementBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
          this.joinServer((event.target as any).id);
        });
      });
    } else {
      listElement.innerHTML = `
      <p>No server to join. Create your own server</p>
      `;
    }
  }

  async joinServer(serverID: string) {
    try {
      let capacity: any;
      const serverRef = ref(realtimeDB, `servers/${serverID}`);
      const result = await runTransaction(serverRef, (serverInfo) => {
        if (serverInfo) {
          if (serverInfo.joined < serverInfo.playersCapacity) {
            serverInfo.joined++;
            capacity = serverInfo.playersCapacity;

            if (serverInfo.joined == serverInfo.playersCapacity) {
              serverInfo.open = false;
            }
            return serverInfo;
          }
        }
      });
      if (!result.committed) {
        throw new Error("server full");
      } else {
        let playersListRef = ref(realtimeDB, `servers/${serverID}/players`);

        const newPlayersListRef = push(playersListRef);

        set(newPlayersListRef, {
          name: store.getState().authState.userName,
          points: store.getState().authState.points,
        });

        off(
          query(
            ref(realtimeDB, "servers/"),
            orderByChild("open"),
            equalTo(true)
          )
        );

        store.dispatch(
          gameSlice.actions.initialSetUp({
            serverID: serverID,
            lobbyID: newPlayersListRef.key,
            playersCapacity: capacity,
          })
        );

        document.querySelector(".waiting-pannel .total-players")!.textContent =
          capacity;

        onValue(ref(realtimeDB, `servers/${serverID}/joined`), (snapshot) => {
          store.dispatch(gameSlice.actions.updateJoinedCount(snapshot.val()));

          document.querySelector(
            ".waiting-pannel .current-players"
          )!.textContent = snapshot.val();

          if (capacity == snapshot.val()) {
            off(ref(realtimeDB, `servers/${serverID}/joined`));
          }
        });
      }
    } catch (error: any) {
      this.displayError({ type: "joiningServerError", message: "" });
    }
  }

  private constructCustomServerLayout() {
    let addedElementInnerHtml = `
    <h3>Custom Server</h3>
    <span class="back-icon">
      <img src="${backArrowIcon}" alt="left arrow icon">
    </span>
    <form id="server-form">
      <input type="text" id="server-name" placeholder="Enter Server Name" />
      <fieldset class="players">
        <legend>Please select no. of players:</legend>
        <div>
          <input type="radio" id="2-players" name="players" value="2" checked>
          <label for="2-players">2</label>
        </div>
        <div>
          <input type="radio" id="3-players" name="players" value="3">
          <label for="3-players">3</label>
        </div>
        <div>
          <input type="radio" id="4-players" name="players" value="4">
          <label for="4-players">4</label>
          </div>
      </fieldset>
      <button type="submit" disabled >Create</button>
    </form>
    `;

    createCustomElement(
      this.rightContainer,
      "div",
      ["container", "custom-server", "display-none"],
      addedElementInnerHtml
    );
  }

  private constructWaitingLayout() {
    let addedElelementInnerHtml = `
    <h3><span class="current-players"></span>/<span class="total-players"></span> joined the server</h3>
    <h4>Waiting for other players to join the lobby ...</h4>
    <button>Quit</button>
    `;

    createCustomElement(
      this.rightContainer,
      "div",
      ["waiting-pannel", "container", "display-none"],
      addedElelementInnerHtml
    );
  }

  checkInput() {
    let value = this.serverNameInput.value.trim();
    let noSpace: boolean = [...value].every((char) => char != " ");

    if (value.length > 8) {
      let message = `The name of the server should not be greater than 5 characters. The name you have entered has ${value.length} characters`;
      this.displayError({
        type: "serverNameError",
        message,
      });
      this.customServerBtn.disabled = true;
    } else if (!noSpace) {
      let message =
        "Entered text has space inbetween. server name can't contain spaces";
      this.displayError({
        type: "serverNameError",
        message,
      });
      this.customServerBtn.disabled = true;
    } else if (value.length < 4) {
      let message = `Server name is too short. It must contain atleast 4 characters. Right now it contains ${value.length}`;
      this.displayError({
        type: "serverNameError",
        message,
      });
      this.customServerBtn.disabled = true;
    } else {
      this.customServerBtn.disabled = false;
      document.querySelector("#server-name-error")?.remove();
      Home.serverNameSuggestionCount = 0;
    }
  }

  createServer() {
    try {
      let serverName = (
        document.querySelector("#server-name")! as HTMLInputElement
      ).value.trim();

      let playersCapacity: number | null = null;

      let i = 0;
      while (i < 3) {
        let element = (
          document.querySelector("#server-form fieldset")! as HTMLFormElement
        ).elements[i] as HTMLInputElement;

        if (element.checked) {
          playersCapacity = Number(element.value);
          break;
        }

        i++;
      }

      let serverID =
        serverName +
        store
          .getState()
          .authState.uid?.slice(0, 8)
          .split("")
          .reverse()
          .join("") +
        Date.now();

      set(ref(realtimeDB, "servers/" + serverID), {
        serverID: serverID,
        serverName: serverName,
        playersCapacity: playersCapacity,
        joined: 1,
        open: true,
        players: [],
      });

      let playersListRef = ref(realtimeDB, `servers/${serverID}/players`);

      const newPlayersListRef = push(playersListRef);

      set(newPlayersListRef, {
        name: store.getState().authState.userName,
        points: store.getState().authState.points,
      });

      store.dispatch(
        gameSlice.actions.initialSetUp({
          serverID: serverID,
          lobbyID: newPlayersListRef.key,
          playersCapacity: playersCapacity,
        })
      );

      document.querySelector(".waiting-pannel .total-players")!.textContent =
        String(playersCapacity!);

      // To get the latest count on the number of joined
      onValue(ref(realtimeDB, `servers/${serverID}/joined`), (snapshot) => {
        store.dispatch(gameSlice.actions.updateJoinedCount(snapshot.val()));

        document.querySelector(
          ".waiting-pannel .current-players"
        )!.textContent = snapshot.val();

        if (playersCapacity == snapshot.val()) {
          off(ref(realtimeDB, `servers/${serverID}/joined`));
        }
      });
    } catch (error: any) {
      this.displayError({
        type: "creatingServerError",
        message: error.message,
      });
      console.log(error.message, error.code);
    }
  }

  private displayError({ type, message }: { type: string; message: string }) {
    switch (type) {
      case "serverNameError": {
        if (Home.serverNameSuggestionCount == 0) {
          let addedMainInnerHtml = `
          <img src="${errorModalCloseIcon}" alt="close icon" />
          <h4>Server Name Error</h4>
          <p>${message}</p>
          `;

          createCustomElement(
            Home.errorModal,
            "div",
            ["error-message"],
            addedMainInnerHtml,
            "server-name-error"
          );

          Home.serverNameSuggestionCount = 1;

          document
            .querySelector("#server-name-error")
            ?.addEventListener("click", () => {
              Home.serverNameSuggestionCount = 0;
              document.querySelector("#server-name-error")?.remove();
            });
        } else {
          document.querySelector("#server-name-error p")!.textContent = message;
        }
        break;
      }
      case "creatingServerError": {
        if (Home.creatingServerErrorCount == 0) {
          let addedMainInnerHtml = `
          <img src="${errorModalCloseIcon}" alt="close icon" />
          <h4>Creating Server Error</h4>
          <p>${message}</p>
          `;

          createCustomElement(
            Home.errorModal,
            "div",
            ["error-message"],
            addedMainInnerHtml,
            "creating-server-error"
          );

          Home.creatingServerErrorCount = 1;

          document
            .querySelector("#creating-server-error")
            ?.addEventListener("click", () => {
              Home.creatingServerErrorCount = 0;
              document.querySelector("#creating-server-error")?.remove();
            });
        } else {
          document.querySelector("#creating-server-error p")!.textContent =
            message;
        }
        break;
      }
      case "joiningServerError": {
        if (Home.joiningServerErrorCount == 0) {
          let addedMainInnerHtml = `
          <img src="${errorModalCloseIcon}" alt="close icon" />
          <h4>Joining Server Error</h4>
          <p>Sorry! server is already full. Try to join on a new server</p>
          `;

          createCustomElement(
            Home.errorModal,
            "div",
            ["error-message"],
            addedMainInnerHtml,
            "joining-server-error"
          );

          Home.joiningServerErrorCount = 1;

          document
            .querySelector("#joining-server-error")
            ?.addEventListener("click", () => {
              Home.joiningServerErrorCount = 0;
              document.querySelector("#joining-server-error")?.remove();
            });
        }
        break;
      }
    }
  }
}

const homeObject = new Home();

export default homeObject;

import store from "../Store/store";
import createCustomElement from "../HelperModules/createCustomElement";
import { onValue, ref } from "firebase/database";
import { realtimeDB } from "../firebase.config";
import { setPlayersInfo } from "../Store/Slices/gameSlice";
import cardObject from "./Card";

const trophyIcon = require("../../assets/trophy_icon.png").default;
const callUnoIcon = require("../../assets/call-uno-icon.png").default;
const skipIcon = require("../../assets/skip-icon.png").default;

class Lobby {
  private static root: HTMLElement = document.querySelector("#root")!;
  lobbySection: HTMLElement | null = null;
  lobbyConstructInitiated: boolean;

  constructor() {
    this.lobbyConstructInitiated = false;
  }

  async fetchPlayersInfo() {
    try {
      let sessionInfo = store.getState().gameState;
      onValue(
        ref(realtimeDB, `servers/${sessionInfo.serverID}/players`),
        (snapshot) => {
          if (snapshot.exists()) {
            let playersInfo: { id: string; name: string; points: number }[] =
              [];

            for (const [id, info] of Object.entries(snapshot.val())) {
              playersInfo.push({
                id: id,
                ...(info as { name: string; points: number }),
              });
            }

            store.dispatch(setPlayersInfo(playersInfo));
            if (
              store.getState().gameState.joined ==
              store.getState().gameState.playersInfo.length
            ) {
              this.lobbyLayoutConstructor();
            }
          }
        }
      );
    } catch (error: any) {
      console.log(error.message, error.code);
    }
  }

  reltiveContainerSizeSet(
    parentElement: HTMLElement,
    relativeElement: HTMLElement
  ) {
    const parentWidth = parentElement?.clientWidth;
    const parentHeight = parentElement?.clientHeight;

    relativeElement
      ? (relativeElement.style.width = `${parentHeight}px`)
      : null;
    relativeElement
      ? (relativeElement.style.height = `${parentWidth}px`)
      : null;
  }

  toResizePlayersContainer(playersCapacity: number) {
    // Dynamically setting the width and height of player-2 and 3 conatiner based on the height and width of grid cell they were assigned

    const player2Parent = document.querySelector("#player-2") as HTMLElement;
    const player2Relative = document.querySelector(
      "#player-2 .relative-container"
    ) as HTMLElement;

    const player3Parent = document.querySelector("#player-3") as HTMLElement;
    const player3Relative = document.querySelector(
      "#player-3 .relative-container"
    ) as HTMLElement;

    const player4Parent = document.querySelector("#player-4") as HTMLElement;
    const player4Relative = document.querySelector(
      "#player-4 .relative-container"
    ) as HTMLElement;

    function players_4_EventHandler(this: Lobby) {
      if (this.lobbySection?.classList.contains("players-4")) {
      }
    }

    // Whenever screen resizes
    if (playersCapacity == 3) {
      this.reltiveContainerSizeSet(player2Parent, player2Relative);
      this.reltiveContainerSizeSet(player3Parent, player3Relative);

      window.addEventListener("resize", () => {
        this.reltiveContainerSizeSet(player2Parent, player2Relative);
        this.reltiveContainerSizeSet(player3Parent, player3Relative);
      });
    } else if (playersCapacity == 4) {
      this.reltiveContainerSizeSet(player2Parent, player2Relative);
      this.reltiveContainerSizeSet(player4Parent, player4Relative);

      window.addEventListener("resize", () => {
        this.reltiveContainerSizeSet(player2Parent, player2Relative);
        this.reltiveContainerSizeSet(player4Parent, player4Relative);
      });
    }
  }

  lobbyLayoutConstructor() {
    let sessionInfo = store.getState().gameState;

    let arr = [...sessionInfo.playersInfo];

    let currentPlayerIndex = sessionInfo.playersInfo.findIndex(
      (info) => info.id == store.getState().gameState.lobbyID
    );

    let playerOrder = arr.splice(currentPlayerIndex).concat(arr);

    // Reseting prev created layout
    if (document.querySelector(".lobby")) {
      console.log("lobby layout change");
    } else {
      let addedElelementInnerHtml = `
    ${playerOrder
      .map(
        (player, index) => `
      <div class="player-container" id="player-${index + 1}">
      <div class="relative-container">
        <div class="player-info">
          <h5>${player.name}</h5>
          <span>${player.points} <img src="${trophyIcon}"/></span>
          <span class="border"></span>
        </div>
        <div class="cards">
        </div>
      </div>
      </div>
    `
      )
      .join("\n")}
      <div class="main-deck">
        <div class="card-container">
          <div class="unFlippedCards">
          </div>
          <div class="flippedCards">
          </div>
        </div>
        <button id="call-uno">
          <img src="${callUnoIcon}" alt="UNO call icon" />
        </button>
        <button id="current-color"><span></span></button>
        <button id="skip-chance">
          <img src="${skipIcon}" alt="icon for skiping chance" />
        </button>
      </div>
    `;

      createCustomElement(
        Lobby.root,
        "section",
        ["lobby", `players-${sessionInfo.joined}`],
        addedElelementInnerHtml
      );

      this.lobbySection = document.querySelector(".lobby");
    }

    if (sessionInfo.joined > 2) {
      this.toResizePlayersContainer(sessionInfo.joined);
    } else {
      document
        .querySelector("#player-2 .relative-container")
        ?.setAttribute("style", "");
    }

    onValue(
      ref(realtimeDB, `servers/${sessionInfo.serverID}/players`),
      (snapshot) => {
        if (snapshot.exists()) {
          cardObject.cardDistributionHandler();
        }
      }
    );
  }

  initiateLobby() {
    let sessionInfo = store.getState().gameState;
    if (
      !this.lobbyConstructInitiated &&
      sessionInfo.joined == sessionInfo.playersCapacity &&
      sessionInfo.joined != 0
    ) {
      lobbyObject.fetchPlayersInfo();
      this.lobbyConstructInitiated = true;
    } else if (this.lobbyConstructInitiated && !sessionInfo.serverID) {
      this.lobbyConstructInitiated = false;
    }
  }
}

const lobbyObject = new Lobby();
lobbyObject.initiateLobby();

export default lobbyObject;

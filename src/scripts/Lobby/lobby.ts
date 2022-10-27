import store from "../Store/store";
import createCustomElement from "../HelperModules/createCustomElement";
import { onValue, ref } from "firebase/database";
import { realtimeDB } from "../firebase.config";
import { setPlayersInfo } from "../Store/Slices/gameSlice";

// type serverData = {
//   serverID: string;
//   lobbyID: string;
//   playersInfo: { id: string; name: string; point: string }[];
//   totalPlayers: number;
//   joined: number;
// };

class Lobby {
  private static root: HTMLElement = document.querySelector("#root")!;
  lobbySection: HTMLElement | null = null;

  constructor() {
    this.fetchPlayersInfo();
  }

  private fetchPlayersInfo() {
    try {
      let sessionInfo = store.getState().gameState;
      onValue(
        ref(realtimeDB, `servers/${sessionInfo.serverID}/players`),
        (snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            let playersInfo: { id: string; name: string; points: number }[] =
              [];

            for (const [id, info] of Object.entries(snapshot.val())) {
              playersInfo.push({
                id: id,
                ...(info as { name: string; points: number }),
              });
            }

            store.dispatch(setPlayersInfo(playersInfo));
            this.lobbyLayoutConstructor();
          }
        }
      );
    } catch (error: any) {
      console.log(error.message, error.code);
    }
  }

  lobbyLayoutConstructor() {
    // Reseting prev created layout
    if (this.lobbySection) {
      console.log("here");
      this.lobbySection.remove();
    }
    let sessionInfo = store.getState().gameState;

    let arr = [...sessionInfo.playersInfo];

    let currentPlayerIndex = sessionInfo.playersInfo.findIndex(
      (info) => info.id == store.getState().gameState.lobbyID
    );

    let playerOrder = arr.splice(currentPlayerIndex).concat(arr);

    let addedElelementInnerHtml = `
    ${playerOrder
      .map(
        (player, index) => `
      <div id="player-${index + 1}">
        <div class="container">
          <div class="player-info">
          <h5>${player.name}</h5>
          <span>${player.points}</span>
        </div>
        <span class="border"></span>
        <div class="cards">
        </div>
        </div>
      </div>
    `
      )
      .join("\n")}
    <div class="main-deck">
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
}

const lobbyObject = new Lobby();

export default lobbyObject;

import cards from "../Store/cardsArr";
import loaderObject from "../Loader/loader";
import store from "../Store/store";
import {
  onValue,
  ref,
  set,
  push,
  update,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import { realtimeDB } from "../firebase.config";
import createCustomElement from "../HelperModules/createCustomElement";

const wildColorIcon = require("../../assets/wild_card_icon.png").default;
const drawFourIcon = require("../../assets/draw_four_icon.png").default;
const skipCardIcon = require("../../assets/skip_card_icon.png").default;
const cardBackBG = require("../../assets/card-back-bg.png").default;
const reverseIcon = require("../../assets/reverse_icon.png").default;

interface digitCard {
  type: "digit";
  color: "red" | "blue" | "green" | "yellow";
  digit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

interface actionCard {
  type: "action";
  color: "red" | "blue" | "green" | "yellow";
  action: "reverse" | "skip" | "draw";
}

interface wildCard {
  type: "wild";
  action: "color" | "draw";
}

type cards = digitCard | actionCard | wildCard;

class Card {
  private cardsDistributed: boolean;

  constructor() {
    this.cardsDistributed = false;
  }

  private shuffleCards() {
    cards.forEach((card, index) => {
      let randomIndex = Math.trunc(Math.random() * 108);
      [cards[randomIndex], cards[index]] = [card, cards[randomIndex]];
    });
  }

  createCurrentPlayerCardsStruct(
    id: string,
    eventType: "add" | "delete",
    data?: cards
  ) {
    let cardContainer = document.querySelector(
      "#player-1 .relative-container .cards"
    )! as HTMLElement;

    switch (eventType) {
      case "add": {
        if (data) {
          let cardHtml: string;
          switch (data.type) {
            case "wild": {
              cardHtml = `
              <div class="top-left">
                ${data.action == "color" ? `<img src=${wildColorIcon}/>` : "+4"}
              </div>
              <div class="middle">
                <img src=${
                  data.action == "color" ? wildColorIcon : drawFourIcon
                } />
              </div>
              <div class="bottom-right">
              ${data.action == "color" ? `<img src=${wildColorIcon}/>` : "+4"}
              </div>
              `;
              break;
            }
            case "action": {
              cardHtml = `
              <div class="top-left">
              ${
                data.action == "skip"
                  ? `<img src=${skipCardIcon} />`
                  : data.action == "reverse"
                  ? `<img src=${reverseIcon} />`
                  : "+2"
              }
              </div>
              <div class="middle">
              ${
                data.action == "skip"
                  ? `<img src=${skipCardIcon} />`
                  : data.action == "reverse"
                  ? `<img src=${reverseIcon} />`
                  : "+2"
              }
              </div>
              <div class="bottom-right">
              ${
                data.action == "skip"
                  ? `<img src=${skipCardIcon} />`
                  : data.action == "reverse"
                  ? `<img src=${reverseIcon} />`
                  : "+2"
              }
              </div>
            `;
              break;
            }
            default: {
              cardHtml = `
              <div class="top-left">
                ${data.digit}
              </div>
              <div class="middle-bg"></div>
              <div class="middle">
                ${data.digit}
              </div>
              <div class="bottom-right">
                ${data.digit}
              </div>
            `;
              break;
            }
          }
          createCustomElement(
            cardContainer,
            "div",
            ["card-front", "card"],
            cardHtml,
            id,
            data as {}
          );
        }
        break;
      }
      case "delete": {
        document
          .querySelector(`#player-1 .relative-container .cards #${id}`)
          ?.remove();
        break;
      }
    }
  }

  createOtherPlayerCardsStruct(n: number, playerindex: number) {
    let cardContainer: HTMLElement | null = document.querySelector(
      `#player-${playerindex} .relative-container .cards`
    );

    cardContainer
      ? (cardContainer.innerHTML =
          `<div class="card" style="background: url(${cardBackBG})">
      </div>`.repeat(n))
      : null;
  }

  createFlippedCard(cardData: cards, id: string) {
    let cardContainer = document.querySelector(
      ".main-deck .flippedCards"
    )! as HTMLElement;

    switch (cardData.type) {
      case "wild": {
        cardContainer.innerHTML = `
              <div class="card-front card" data-type="wild" data-action=${
                cardData.action
              } id=${id}>
              <div class="top-left">
                ${
                  cardData.action == "color"
                    ? `<img src=${wildColorIcon}/>`
                    : "+4"
                }
              </div>
              <div class="middle" data-type="wild" data-action=${
                cardData.action
              }>
                <img src=${
                  cardData.action == "color" ? wildColorIcon : drawFourIcon
                } />
              </div>
              <div class="bottom-right">
              ${
                cardData.action == "color"
                  ? `<img src=${wildColorIcon}/>`
                  : "+4"
              }
              </div>
              </div>
              `;
        break;
      }
      case "action": {
        cardContainer.innerHTML = `
              <div class="card-front card" data-type="action" data-color=${
                cardData.color
              } data-action=${cardData.action} id=${id}>
              <div class="top-left">
              ${
                cardData.action == "skip"
                  ? `<img src=${skipCardIcon} />`
                  : cardData.action == "reverse"
                  ? `<img src=${reverseIcon} />`
                  : "+2"
              }
              </div>
              <div class="middle">
              ${
                cardData.action == "skip"
                  ? `<img src=${skipCardIcon} />`
                  : cardData.action == "reverse"
                  ? `<img src=${reverseIcon} />`
                  : "+2"
              }
              </div>
              <div class="bottom-right">
              ${
                cardData.action == "skip"
                  ? `<img src=${skipCardIcon} />`
                  : cardData.action == "reverse"
                  ? `<img src=${reverseIcon} />`
                  : "+2"
              }
              </div>
              </div>
            `;
        break;
      }
      default: {
        cardContainer.innerHTML = `
              <div class="card-front card" data-type="digit" data-digit=${cardData.digit} data-color=${cardData.color} id=${id}>
              <div class="top-left">
                ${cardData.digit}
              </div>
              <div class="middle-bg"></div>
              <div class="middle">
                ${cardData.digit}
              </div>
              <div class="bottom-right">
                ${cardData.digit}
              </div>
              </div>
            `;
        break;
      }
    }
  }

  createUnFlippedCard() {
    if (!document.querySelector(".main-deck .unFlippedCards .card")) {
      (
        document.querySelector(".main-deck .unFlippedCards")! as HTMLElement
      ).innerHTML = `<div class="card" style="background: url(${cardBackBG})">
      </div>`;
    }
  }

  setPlayerCards() {
    console.log("setting started");
    let { serverID, lobbyID, playersInfo } = store.getState().gameState;

    // changing playerOrder according to lobby layout of players
    let arr = [...playersInfo];
    let currPlayerIndex = playersInfo.findIndex((info) => info.id == lobbyID);
    let playerOrder = arr.splice(currPlayerIndex).concat(arr);

    playerOrder.forEach((player, index) => {
      if (player.id == lobbyID) {
        onChildAdded(
          ref(realtimeDB, `cards/${serverID}/${lobbyID}`),
          (snapshot) => {
            if (snapshot.exists()) {
              console.log("adding curr player cards");
              this.cardsDistributed = true;
              let cardID = snapshot.key!;
              let cardData = snapshot.val() as cards;
              this.createCurrentPlayerCardsStruct(cardID, "add", cardData);
            }
          }
        );
        onChildRemoved(
          ref(realtimeDB, `cards/${serverID}/${lobbyID}`),
          (snapshot) => {
            console.log("removing card from curr player");
            if (snapshot.exists()) {
              let cardID = snapshot.key!;
              this.createCurrentPlayerCardsStruct(cardID, "delete");
            }
          }
        );
      } else {
        onValue(
          ref(realtimeDB, `cards/${serverID}/${player.id}`),
          (snapshot) => {
            const id = playerOrder.findIndex(
              (currPlayer) => currPlayer.id == player.id
            );
            if (snapshot.exists()) {
              console.log("setting other player cards");
              let numberOfCards = Object.entries(snapshot.val()).length;
              this.createOtherPlayerCardsStruct(numberOfCards, id + 1);
            } else {
              console.log("here why!!!!!!!", console.log(player.id));
              this.createOtherPlayerCardsStruct(0, id + 1);
            }
          }
        );
      }
    });

    onValue(ref(realtimeDB, `cards/${serverID}/flipped/`), (snapshot) => {
      if (snapshot.exists()) {
        let cardID = Object.keys(snapshot.val())[0];
        let cardData = Object.values(snapshot.val())[0] as cards;

        this.createFlippedCard(cardData, cardID);
      }
    });

    onValue(ref(realtimeDB, `cards/${serverID}/unFlipped/`), (snapshot) => {
      if (snapshot.exists()) {
        this.createUnFlippedCard();
      } else {
        console.log("reshuffle the cards");
      }
    });
  }

  async cardDistributionHandler() {
    console.log("distributing cards");
    loaderObject.initiateLoader();
    let { playersInfo, joined, lobbyID, serverID } = store.getState().gameState;

    if (!this.cardsDistributed && lobbyID == playersInfo[0].id) {
      this.shuffleCards();

      let currIndex = 0;

      for (let i = 0; i < joined * 7; i++) {
        set(
          push(
            ref(realtimeDB, `cards/${serverID}/${playersInfo[currIndex].id}`)
          ),
          {
            ...cards.splice(0, 1)[0],
          }
        );
        if (currIndex == joined - 1) {
          currIndex = 0;
        } else {
          currIndex++;
        }
      }

      await set(push(ref(realtimeDB, `cards/${serverID}/flipped`)), {
        ...cards.splice(0, 1)[0],
      });

      await update(ref(realtimeDB, `cards/${serverID}`), {
        unFlipped: cards.splice(0),
      }).then(() => {
        this.cardsDistributed = true;
        console.log("initiated");
        update(ref(realtimeDB, `cards/${serverID}/`), {
          distributed: true,
        }).then(() => {
          this.setPlayerCards();
          loaderObject.removeLoader();
        });
      });
    } else if (!this.cardsDistributed) {
      onValue(ref(realtimeDB, `cards/${serverID}/distributed`), (snapshot) => {
        if (snapshot.exists() && snapshot.val() == true) {
          console.log("now");
          this.setPlayerCards();
          loaderObject.removeLoader();
        } else {
          loaderObject.removeLoader();
        }
      });
    } else {
      console.log("rearrange alreadu distributed cards");
      loaderObject.removeLoader();
    }
  }
}

let cardObject = new Card();

export default cardObject;

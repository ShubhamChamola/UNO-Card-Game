import "./home.scss";
import createCustomElement from "../HelperFunctions/createCustomElement";

const heroImg = require("../../assets/hero-img-without-bg.png").default;
const backArrowIcon = require("../../assets/back-arrow-icon.png").default;

class Home {
  private static root: HTMLElement = document.querySelector("#root")!;
  rightContainer: HTMLElement;
  homeSection: HTMLElement;
  createServerBtn: HTMLElement;
  joinServerPanel: HTMLElement;
  customServerPanel: HTMLElement;
  backBtn: HTMLElement;

  constructor() {
    Home.constructLayout();
    this.rightContainer = document.querySelector(".right-side")!;
    this.homeSection = document.querySelector(".home")!;
    this.constructServerBrowserLayout();
    this.constructCustomServerLayout();
    this.createServerBtn = document.querySelector(".create-server button")!;
    this.joinServerPanel = document.querySelector(".join-server")!;
    this.customServerPanel = document.querySelector(".custom-server")!;
    this.backBtn = document.querySelector(".back-icon")!;
  }

  private static constructLayout(): void {
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

  private constructServerBrowserLayout(): void {
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
          <li class="server-info">
            <h5>serverID</h5>
            <span>2/3</span>
            <button>Join</button>
          </li>
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
  }

  private constructCustomServerLayout() {
    let addedElementInnerHtml = `
    <h3>Custom Server</h3>
    <span class="back-icon">
      <img src="${backArrowIcon}" alt="left arrow icon">
    </span>
    <form id="server-form">
      <input type="text" id="server-name" placeholder="Enter Server Name" pattern="^\S+$" />
      <fieldset class="players">
        <legend>Please select no. of players:</legend>
        <div>
          <input type="radio" id="2-players" name="players" value="2">
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
      <button type="submit">Create</button>
    </form>
    `;

    createCustomElement(
      this.rightContainer,
      "div",
      ["container", "custom-server", "display-none"],
      addedElementInnerHtml
    );
  }
}

const homeObject = new Home();

export default homeObject;

import "./nav.scss";
import createCustomElement from "../HelperModules/createCustomElement";

const unoLogo = require("../../assets/uno-logo.png").default;
const userIcon = require("../../assets/person-icon.png").default;
const logoutIcon = require("../../assets/logout-icon.png").default;
const fullscreenIcon = require("../../assets/maximize-icon.png").default;
class NavigationClass {
  private navigation: HTMLElement;
  private navLinks: HTMLElement;
  logoutButton: HTMLButtonElement | null;

  constructor() {
    this.navigation = document.querySelector("nav")!;
    this.intialLayoutConstructor();
    this.navLinks = document.querySelector(".nav-links")!;
    this.logoutButton = null;
  }

  private intialLayoutConstructor() {
    this.navigation.innerHTML = `
    <div class="logo">
      <img src ="${unoLogo}" alt="uno game logo" />
    </div>
    <ul class="nav-links">
    </ul>
  `;
  }

  loggedInConstructor(userName: string, points: number): void {
    this.navLinks.innerHTML = `
    <li class="menu-toggle">
      <span></span>
    </li>
    <ul class="links">
      <li class="user-info">
        <div>
          <img src="${userIcon}" alt="icon of user" />
        </div>
        <div>
          <h4>${userName}</h4>
          <span>${points}</span>
        </div>
      </li>
      <li class="logout">
        <button>
          <img src ="${logoutIcon}" alt ="logout icon" />
          LOGOUT
        </button>
      </li>
    </ul>
    `;

    document.querySelector(".menu-toggle")?.addEventListener("click", () => {
      document.querySelector(".links")?.classList.toggle("active");
      document.querySelector(".menu-toggle")?.classList.toggle("menu-active");
    });

    this.logoutButton = document.querySelector(".logout button")!;
  }

  loggedOutContructor(): void {
    this.navLinks.innerHTML = "";
  }

  lobbyConstructor() {
    this.navLinks.innerHTML = `
      <li class="fullscreen">
        <img src="${fullscreenIcon}" alt="fullscreen icon"/>
      </li>
      <li class="exit">
        <img src ="${logoutIcon}" alt="exit icon" />
      </li>
    `;

    // Event for fullscrren
    document.querySelector(".fullscreen img")?.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.querySelector("html")?.requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    });
  }
}

export const navigationObject = new NavigationClass();

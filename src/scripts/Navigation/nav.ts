import "./nav.scss";

const unoLogo = require("../../assets/uno-logo.png").default;
const userIcon = require("../../assets/person-icon.png").default;
const logoutIcon = require("../../assets/logout-icon.png").default;

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
    `;
    this.logoutButton = document.querySelector(".logout button")!;
  }

  loggedOutContructor(): void {
    this.navLinks.innerHTML = "";
  }

  lobbyConstructor() {
    this.navLinks.innerHTML = `
      <li class="exit">
        <img src ="${logoutIcon}" alt="exit icon" />
      </li>
    `;
  }
}

export const navigationObject = new NavigationClass();

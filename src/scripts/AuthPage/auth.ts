import "./auth.scss";
import { auth } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import loaderObject from "../Loader/loader";

const heroImgWithBg = require("../../assets/hero-img-with-bg.jpg").default;
const googleIcon = require("../../assets/google-icon.png").default;
const errorModalCloseIcon =
  require("../../assets/error-modal-close-icon.png").default;
const guestIcon = require("../../assets/person-icon.png").default;

class Auth {
  private static emailPattern =
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}";
  private static passwordPattern =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$";
  private static root = document.querySelector("#root")!;
  private static emailSuggestionCount = 0;
  private static passwordSuggestionCount = 0;
  private static signInErrorCount = 0;
  private static signUpErrorCount = 0;
  private static guestErrorCount = 0;
  private static googleErrorCount = 0;
  protected formHeading: HTMLHeadingElement;
  protected spanAlternate: HTMLSpanElement;
  protected alternateModeSpan: HTMLSpanElement;
  readonly alternateModeButton: HTMLButtonElement;
  readonly emailInput: HTMLInputElement;
  readonly passwordInput: HTMLInputElement;
  private readonly errorModal: HTMLElement;
  authSection: HTMLElement;
  formButton: HTMLButtonElement;
  guestButton: HTMLElement;
  googleButton: HTMLElement;
  private static provider = new GoogleAuthProvider();

  constructor() {
    Auth.initialLayoutConstructor();
    this.authSection = document.querySelector(".auth")!;
    this.formHeading = document.querySelector(".auth-input h3")!;
    this.formButton = document.querySelector(".auth-input form button")!;
    this.spanAlternate = document.querySelector(
      ".auth-input .alternates span"
    )!;
    this.alternateModeSpan = document.querySelector(
      ".auth-input .alternate-mode span"
    )!;
    this.alternateModeButton = document.querySelector(
      ".auth-input .alternate-mode button"
    )!;
    this.signInConstruct();
    this.emailInput = document.querySelector("#email")!;
    this.passwordInput = document.querySelector("#password")!;
    this.errorModal = document.querySelector(".error-modal")!;
    this.guestButton = document.querySelector("#guest-sign")!;
    this.googleButton = document.querySelector("#google-sign")!;
  }

  private static initialLayoutConstructor(): void {
    this.root.innerHTML = `
    <section class="auth">
      <div class="hero-img">
        <img src="${heroImgWithBg}" alt="uno game image with cards"/>
      </div>
      <div class="auth-input">
        <h3></h3>
        <form>
          <input type="email" id="email" placeholder="Email" pattern="${this.emailPattern}" title ="Enter valid email"/>
          <input type="password" id="password" placeholder="Password" pattern="${this.passwordPattern}"/>
          <button disabled type="submit"></button>
        </form>
        <div class="alternates">
          <span></span>
          <div>
            <img id ="google-sign" src="${googleIcon}" alt="google icon">
          </div>
          <div>
            <img id="guest-sign" src="${guestIcon}" alt="google icon">
          </div>
        </div>
        <span class="border-line"></span>
        <div class="alternate-mode">
          <span></span>
          <button type="submit"></button>
        </div>
      </div>
      <div class="error-modal"></div>
    </section>
    `;
  }

  removeAuthFromDOM() {
    this.authSection.style.display = "none";
  }

  addAuthInDOM() {
    this.authSection.style.display = "";
  }

  signInConstruct(): void {
    this.formHeading.innerText = "Login";
    this.formButton.innerText = "LOGIN";
    this.spanAlternate.innerText = "Or login with";
    this.alternateModeSpan.innerText = "Do not have an account yet?";
    this.alternateModeButton.innerText = "JOIN NOW";
  }

  signUpConstruct(): void {
    this.formHeading.innerText = "Sign Up";
    this.formButton.innerText = "SIGN UP";
    this.spanAlternate.innerText = "Or sign up with";
    this.alternateModeSpan.innerText = "Already have an account?";
    this.alternateModeButton.innerText = "LOGIN NOW";
  }

  checkEmailInput(): void {
    if (
      this.emailInput.validity.valid &&
      this.passwordInput.validity.valid &&
      this.passwordInput.value.length >= 6
    ) {
      this.formButton.disabled = false;
    } else {
      this.formButton.disabled = true;
    }
    if (this.emailInput.validity.valid) {
      Auth.emailSuggestionCount = 0;
      document.querySelector("#email-error")?.remove();
    } else if (Auth.emailSuggestionCount == 0) {
      this.displayError({ type: "emailError", message: "" });
    }
  }

  checkPasswordInput(): void {
    if (
      this.emailInput.validity.valid &&
      this.passwordInput.validity.valid &&
      this.passwordInput.value.length >= 6
    ) {
      this.formButton.disabled = false;
    } else {
      this.formButton.disabled = true;
    }
    if (
      this.passwordInput.validity.valid &&
      this.passwordInput.value.trim().length > 0
    ) {
      Auth.passwordSuggestionCount = 0;
      document.querySelector("#password-error")?.remove();
    } else if (Auth.passwordSuggestionCount == 0) {
      this.displayError({ type: "passwordError", message: "" });
    }
  }

  async signUpHandler(): Promise<void> {
    try {
      loaderObject.initiateLoader();
      const response = await createUserWithEmailAndPassword(
        auth,
        this.emailInput.value.trim(),
        this.passwordInput.value.trim()
      );
      document.querySelector(".error-modal #sign-up-error")?.remove();
      Auth.signUpErrorCount = 0;
      loaderObject.removeLoader();
    } catch (error: any) {
      loaderObject.removeLoader();
      this.displayError({ type: "signUpError", message: error.message });
      console.log(error?.code, error?.message);
    }
  }

  async signInHandler(): Promise<void> {
    try {
      loaderObject.initiateLoader();
      const response = await signInWithEmailAndPassword(
        auth,
        this.emailInput.value.trim(),
        this.passwordInput.value.trim()
      );
      loaderObject.removeLoader();
      document.querySelector(".error-modal #sign-in-error")?.remove();
      Auth.signInErrorCount = 0;
    } catch (error: any) {
      loaderObject.removeLoader();
      this.displayError({ type: "signInError", message: error.message });
      console.log(error?.code, error?.message);
    }
  }

  async googleSignIn() {
    try {
      loaderObject.initiateLoader();
      const response = await signInWithPopup(auth, Auth.provider);
      console.log(response.user);
      document.querySelector(".error-modal #google-error")?.remove();
      Auth.googleErrorCount = 0;
      loaderObject.removeLoader();
    } catch (error: any) {
      this.displayError({ type: "googleError", message: error.message });
      loaderObject.removeLoader();
    }
  }

  async guestSignIn() {
    try {
      loaderObject.initiateLoader();
      const response = await signInAnonymously(auth);
      console.log(response.user);
      document.querySelector(".error-modal #guest-error")?.remove();
      Auth.guestErrorCount = 0;
      loaderObject.removeLoader();
    } catch (error: any) {
      loaderObject.removeLoader();
      this.displayError({ type: "guestError", message: error.message });
      console.log(error.code, error.message);
    }
  }

  private displayError({
    type,
    message,
  }: {
    type: string;
    message: string;
  }): void {
    switch (type) {
      case "signInError": {
        if (Auth.signInErrorCount == 0) {
          this.errorModal.innerHTML += `
          <div class="error-message" id="sign-in-error">
            <img src="${errorModalCloseIcon}" alt="close icon" />
            <h4>Email SignIn Error</h4>
            <p>${message}</p>
          </div>
          `;
          Auth.signInErrorCount = 1;
        } else {
          document.querySelector("#sign-in-error p")!.textContent = message;
        }
        break;
      }
      case "signUpError": {
        if (Auth.signUpErrorCount == 0) {
          this.errorModal.innerHTML += `
          <div class="error-message" id="sign-up-error">
            <img src="${errorModalCloseIcon}" alt="close icon" />
            <h4>Email SignUp Error</h4>
            <p>${message}</p>
          </div>
          `;
          Auth.signUpErrorCount = 1;
        } else {
          document.querySelector("#sign-up-error p")!.textContent = message;
        }
        break;
      }
      case "emailError": {
        if (Auth.emailSuggestionCount == 0) {
          this.errorModal.innerHTML += `
          <div class="error-message" id="email-error">
            <img src="${errorModalCloseIcon}" alt="close icon" />
            <h4>Invalid Email</h4>
            <p>Please check the entered Email</p>
          </div>
          `;
          Auth.emailSuggestionCount = 1;
        }
        break;
      }
      case "passwordError": {
        if (Auth.passwordSuggestionCount == 0) {
          this.errorModal.innerHTML += `
          <div class="error-message" id="password-error">
            <img src="${errorModalCloseIcon}" alt="close icon" />
            <h4>Invalid Password</h4>
            <p>Password must contain a LOWER CASE, UPPER CASE LETTER, a UNIQUE SYMBOL, a DIGIT & the length of the password should be between 6-8</p>
          </div>
          `;
          Auth.passwordSuggestionCount = 1;
        }
        break;
      }
      case "guestError": {
        if (Auth.guestErrorCount == 0) {
          this.errorModal.innerHTML += `
          <div class="error-message" id="guest-error">
            <img src="${errorModalCloseIcon}" alt="close icon" />
            <h4>Guest SignUp Error</h4>
            <p>${message}</p>
          </div>
          `;
          Auth.guestErrorCount = 1;
        } else {
          document.querySelector("#guest-error p")!.textContent = message;
        }
        break;
      }
      case "googleError": {
        if (Auth.googleErrorCount == 0) {
          this.errorModal.innerHTML += `
          <div class="error-message" id="google-error">
            <img src="${errorModalCloseIcon}" alt="close icon" />
            <h4>Google SignUp Error</h4>
            <p>${message}</p>
          </div>
          `;
          Auth.googleErrorCount = 1;
        } else {
          document.querySelector("#google-error p")!.textContent = message;
        }
        break;
      }
    }
    this.errorEvent();
  }

  private errorEvent(): void {
    document.querySelector("#sign-in-error")?.addEventListener("click", () => {
      Auth.signInErrorCount = 0;
      document.querySelector("#sign-in-error")?.remove();
    });
    document.querySelector("#sign-up-error")?.addEventListener("click", () => {
      Auth.signUpErrorCount = 0;
      document.querySelector("#sign-up-error")?.remove();
    });
    document.querySelector("#email-error")?.addEventListener("click", () => {
      Auth.emailSuggestionCount = 0;
      document.querySelector("#email-error")?.remove();
    });
    document.querySelector("#password-error")?.addEventListener("click", () => {
      Auth.passwordSuggestionCount = 0;
      document.querySelector("#password-error")?.remove();
    });
    document.querySelector("#guest-error")?.addEventListener("click", () => {
      Auth.guestErrorCount = 0;
      document.querySelector("#guest-error")?.remove();
    });
    document.querySelector("#google-error")?.addEventListener("click", () => {
      Auth.googleErrorCount = 0;
      document.querySelector("#google-error")?.remove();
    });
  }
}

export const authObject = new Auth();

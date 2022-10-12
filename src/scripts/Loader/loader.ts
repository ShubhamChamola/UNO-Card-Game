import "./loader.scss";

class Loader {
  private static loaderEl = document.querySelector("#loader")! as HTMLElement;
  constructor() {
    this.constructLoayout();
  }

  private constructLoayout() {
    Loader.loaderEl.innerHTML = `
    <div class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    `;
  }

  initiateLoader() {
    Loader.loaderEl.style.display = "block";
  }

  removeLoader() {
    Loader.loaderEl.style.display = "none";
  }
}

const loaderObject = new Loader();

export default loaderObject;

const createCustomElement = (
  parentElement: HTMLElement,
  mainChild: string,
  mainChildClasses: string[],
  mainInnerHtml: string,
  mainChildID: string = ""
): void => {
  let childElement = document.createElement(mainChild);

  childElement.classList.add(...mainChildClasses);
  childElement.id = mainChildID;

  childElement.innerHTML = mainInnerHtml.trim();

  parentElement.appendChild(childElement);
};

export default createCustomElement;

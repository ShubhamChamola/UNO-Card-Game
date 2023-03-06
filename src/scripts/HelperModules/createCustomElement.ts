const createCustomElement = (
  parentElement: HTMLElement,
  mainChild: string,
  mainChildClasses: string[],
  mainInnerHtml: string,
  mainChildID: string = "",
  dataSets: { [key: string]: string } = {}
): void => {
  let childElement = document.createElement(mainChild);

  childElement.classList.add(...mainChildClasses);
  childElement.id = mainChildID;

  childElement.innerHTML = mainInnerHtml.trim();
  if (dataSets) {
    for (const [dataKey, datavalue] of Object.entries(dataSets)) {
      childElement.dataset[dataKey] = datavalue;
    }
  }

  parentElement.appendChild(childElement);
};

export default createCustomElement;

const changeDisplayProp = (
  element: HTMLElement | null,
  value: "hide" | "show"
): void => {
  if (value == "show") {
    element?.classList.remove("display-none");
  } else {
    element?.classList.add("display-none");
  }
};
export default changeDisplayProp;

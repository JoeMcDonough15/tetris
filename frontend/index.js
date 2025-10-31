import {
  createCustomHeading,
  createMainContainer,
} from "./components/index.js";

const bodyArrayFromCollection = Array.from(
  document.getElementsByTagName("body")
);
const body = bodyArrayFromCollection[0];
const mainMenuContainer = createMainContainer("main-menu-container");

body.prepend(
  createCustomHeading("h1", "Main Menu", "main-header"),
  mainMenuContainer
);

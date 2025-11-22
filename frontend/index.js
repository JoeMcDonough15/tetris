import mainMenuPageBuilder from "./pages/mainMenu.js";
import Settings from "./settings.js";
import { returnBody } from "./utils/index.js";

const settingsObj = new Settings();

const body = returnBody();
body.classList.add(`theme-${settingsObj.colorPaletteSelection}`);

mainMenuPageBuilder(settingsObj);

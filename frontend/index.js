import mainMenuPageBuilder from "./pages/mainMenu.js";
import Settings from "./settings.js";
import { returnThemeWrapper } from "./utils/index.js";

const settingsObj = new Settings();

const themeWrapper = returnThemeWrapper();
themeWrapper.classList.add(`theme-${settingsObj.colorPaletteSelection}`);

mainMenuPageBuilder(settingsObj);

import HighScores from "../utils/highScoresHelpers.js";
import {
  createContainer,
  createMenuButtons,
  createHighScoresTable,
  createCustomHeading,
  createLoadingBar,
} from "../components/index.js";
import {
  mainMenuButtonsContainerObj,
  highScoresMenuButtonObjs,
  returnBody,
} from "../utils/index.js";
import playGamePageBuilder from "./playGame.js";
import mainMenuPageBuilder from "./mainMenu.js";

// * Build the UI

const highScoresPageBuilder = async (settingsObj) => {
  // settingsObj will be used to add classes to the elements once the UI options are in place
  const mainHeading = createCustomHeading(
    "h1",
    "High Scores",
    ["main-heading"],
    "main-heading"
  );
  const highScoresContainer = createContainer(
    "main",
    ["high-scores-container", "main-container"],
    "high-scores-container"
  );

  const menuButtons = createMenuButtons(
    mainMenuButtonsContainerObj,
    highScoresMenuButtonObjs
  );

  const loadingBar = createLoadingBar("Fetching High Scores...");

  highScoresContainer.append(loadingBar, menuButtons);

  const body = returnBody();
  body.prepend(mainHeading, highScoresContainer);

  const highScoresObj = new HighScores();
  const highScores = await highScoresObj.getHighScores();
  loadingBar.remove();

  if (highScores.length) {
    highScoresContainer.prepend(createHighScoresTable(highScores));
  } else {
    highScoresContainer.prepend(
      createCustomHeading("h2", "No High Scores Yet", ["no-high-scores-header"])
    );
  }

  // * Event Listeners

  // Event Callbacks
  const handleNewGameButton = () => {
    cleanupFunction();
    playGamePageBuilder(settingsObj);
  };

  const handleMainMenuButton = () => {
    cleanupFunction();
    mainMenuPageBuilder(settingsObj);
  };

  // Target Elements for Event Listeners
  const newGameButton = document.getElementById("new-game-button");
  const mainMenuButton = document.getElementById("main-menu-button");

  // Mouse Events
  newGameButton.addEventListener("click", handleNewGameButton);
  mainMenuButton.addEventListener("click", handleMainMenuButton);

  // * Cleanup Function

  const cleanupFunction = () => {
    const objsWithEventListeners = [
      {
        referenceToElement: newGameButton,
        typeOfEvent: "click",
        callBack: handleNewGameButton,
      },
      {
        referenceToElement: mainMenuButton,
        typeOfEvent: "click",
        callBack: handleMainMenuButton,
      },
    ];

    objsWithEventListeners.forEach((obj) => {
      obj.referenceToElement.removeEventListener(obj.typeOfEvent, obj.callBack);
    });

    const elementsToRemove = [mainHeading, highScoresContainer];

    elementsToRemove.forEach((element) => {
      element.remove();
    });
  };
};

export default highScoresPageBuilder;

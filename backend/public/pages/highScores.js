import HighScores from "../high-scores/js/api/highScoresApi.js";
import {
  createContainer,
  createMenuButtons,
  createHighScoresTable,
  createCustomHeading,
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

  highScoresContainer.appendChild(
    createMenuButtons(mainMenuButtonsContainerObj, highScoresMenuButtonObjs)
  );

  const highScoresObj = new HighScores();
  const highScores = await highScoresObj.getHighScores();

  if (highScores.length) {
    highScoresContainer.prepend(createHighScoresTable(highScores));
  } else {
    highScoresContainer.prepend(
      createCustomHeading("h2", "No High Scores Yet", ["no-high-scores-header"])
    );
  }

  const body = returnBody();
  body.prepend(mainHeading, highScoresContainer);

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

  // Mouse Events
  document
    .getElementById("new-game-button")
    .addEventListener("click", handleNewGameButton);

  document
    .getElementById("main-menu-button")
    .addEventListener("click", handleMainMenuButton);

  // * Cleanup Function

  const cleanupFunction = () => {
    const elementsWithEventListeners = [
      {
        idOfElement: "new-game-button",
        typeOfEvent: "click",
        callBack: handleNewGameButton,
      },
      {
        idOfElement: "main-menu-button",
        typeOfEvent: "click",
        callBack: handleMainMenuButton,
      },
    ];

    elementsWithEventListeners.forEach((element) => {
      document
        .getElementById(element.idOfElement)
        .removeEventListener(element.typeOfEvent, element.callBack);
    });

    const idsOfElementsToRemove = ["main-heading", "high-scores-container"];

    idsOfElementsToRemove.forEach((id) => {
      document.getElementById(id).remove();
    });
  };
};

export default highScoresPageBuilder;

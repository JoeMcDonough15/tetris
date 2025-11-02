import HighScores from "./api/highScoresApi.js";
import {
  createContainer,
  createMenuButtons,
  createHighScoresTable,
  createCustomHeading,
} from "../../components/index.js";
import {
  menuButtonsContainerObj,
  highScoresMenuButtonObjs,
} from "../../utils/index.js";

const bodyArrayFromCollection = Array.from(
  document.getElementsByTagName("body")
);
const body = bodyArrayFromCollection[0];
const highScoresContainer = createContainer("main", ["high-scores-container"]);

body.prepend(
  createCustomHeading("h1", "High Scores", "main-heading"),
  highScoresContainer
);

const highScoresObj = new HighScores();
const highScores = await highScoresObj.getHighScores();

highScoresContainer.appendChild(
  createMenuButtons(menuButtonsContainerObj, highScoresMenuButtonObjs)
);

if (highScores.length) {
  highScoresContainer.appendChild(createHighScoresTable(highScores));
} else {
  highScoresContainer.appendChild(
    createCustomHeading("h2", "No High Scores Yet", "no-high-scores-header")
  );
}

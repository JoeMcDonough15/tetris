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
  returnBody,
} from "../../utils/index.js";

const body = returnBody();
const highScoresContainer = createContainer("main", ["high-scores-container"]);

body.prepend(
  createCustomHeading("h1", "High Scores", ["main-heading"], "main-heading"),
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
    createCustomHeading("h2", "No High Scores Yet", ["no-high-scores-header"])
  );
}

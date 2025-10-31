import HighScores from "./api/highScoresApi.js";
import {
  createMainContainer,
  createNavButtons,
  createHighScoresTable,
  createCustomHeading,
} from "../../components/index.js";

const bodyArrayFromCollection = Array.from(
  document.getElementsByTagName("body")
);
const body = bodyArrayFromCollection[0];
const highScoresContainer = createMainContainer("high-scores-container");

body.prepend(
  createCustomHeading("h1", "High Scores", "main-header"),
  highScoresContainer
);

const highScoresObj = new HighScores();
const highScores = await highScoresObj.getHighScores();

const navButtons = [
  { navDestination: "/play-game", buttonText: "New Game" },
  { navDestination: "/", buttonText: "Main Menu" },
];

highScoresContainer.appendChild(createNavButtons(...navButtons));

if (highScores.length) {
  highScoresContainer.appendChild(createHighScoresTable(highScores));
} else {
  highScoresContainer.appendChild(
    createCustomHeading("h2", "No High Scores Yet", "no-high-scores-header")
  );
}

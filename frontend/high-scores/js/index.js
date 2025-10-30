import HighScores from "./api/highScoresApi.js";
import {
  createNavButtons,
  createHighScoresTable,
  noHighScoresHeader,
} from "../../components/index.js";

const highScoresObj = new HighScores();
const highScores = await highScoresObj.getHighScores();
const highScoresContainer = document.getElementById("high-scores-container");
const navButtons = [
  { navDestination: "/play-game", buttonText: "New Game" },
  { navDestination: "/", buttonText: "Main Menu" },
];

highScoresContainer.appendChild(createNavButtons(...navButtons));

if (highScores.length) {
  highScoresContainer.appendChild(createHighScoresTable(highScores));
} else {
  highScoresContainer.appendChild(noHighScoresHeader());
}

// import { getHighScores } from "./api/highScoresApi";

// const highScores = await getHighScores();

import HighScores from "./highScoresApi.js";

const highScoresObj = new HighScores();

const highScores = await highScoresObj.getHighScores();

console.log("high scores: ", highScores);

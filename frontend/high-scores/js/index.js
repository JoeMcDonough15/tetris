import HighScores from "./api/highScoresApi.js";

const highScoresObj = new HighScores();
const highScores = await highScoresObj.getHighScores();

if (highScores.length > 0) {
  const highScoresContainer = document.getElementById("high-scores-container");
  const highScoresTable = document.createElement("table");
  const highScoresTableHeader = document.createElement("thead");
  const highScoresTableBody = document.createElement("tbody");
  const highScoresTableHeaderRow = document.createElement("tr");
  const highScoresTablePlayerNameHeader = document.createElement("td");
  const highScoresTablePlayerScoreHeader = document.createElement("td");
  highScoresTablePlayerNameHeader.innerText = "Player Name";
  highScoresTablePlayerScoreHeader.innerText = "Score";
  highScoresTableHeaderRow.append(
    highScoresTablePlayerNameHeader,
    highScoresTablePlayerScoreHeader
  );
  highScoresTableHeader.appendChild(highScoresTableHeaderRow);

  highScores.forEach((scoreObj) => {
    const highScoreBodyRow = document.createElement("tr");
    const highScoreBodyRowPlayerName = document.createElement("td");
    const highScoreBodyRowPlayerScore = document.createElement("td");
    highScoreBodyRowPlayerName.innerText = scoreObj.name;
    highScoreBodyRowPlayerScore.innerText = scoreObj.score;
    highScoreBodyRow.append(
      highScoreBodyRowPlayerName,
      highScoreBodyRowPlayerScore
    );

    highScoresTableBody.appendChild(highScoreBodyRow);
  });

  highScoresTable.append(highScoresTableHeader, highScoresTableBody);
  highScoresContainer.appendChild(highScoresTable);
}

class HighScores {
  // get all high scores
  getHighScores = async () => {
    const highScores = await fetch("/api/high-scores").then(
      async (data) => await data.json()
    );

    return highScores;
  };

  // add a player's score to the high scores.
  addScoreToHighScores = async (playerDetails) => {
    return fetch("/api/high-scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerDetails),
    }).then((response) => response.json());
  };

  // remove a high score by id since we are only ever keeping 10 high scores
  removeHighScore = async (idOfScoreToRemove) => {
    return fetch(`/api/high-scores/${idOfScoreToRemove}`, {
      method: "DELETE",
    });
  };
}

export default HighScores;

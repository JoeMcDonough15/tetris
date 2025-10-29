class HighScores {
  getHighScores = async () => {
    const highScores = await fetch("/api/high-scores").then(
      async (data) => await data.json()
    );

    return highScores;
  };
}

export default HighScores;

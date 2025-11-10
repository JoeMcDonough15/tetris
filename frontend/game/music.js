import { generateMusicPath } from "../../../utils/index.js";

class GameMusic {
  constructor(selectedTheme) {
    this.player = new Audio(generateMusicPath(selectedTheme));
    this.selectedMusic = selectedTheme;
    this.player.loop = true;
  }
  // methods
  changeMusic = (newTheme) => {
    this.player.src = generateMusicPath(newTheme);
    this.selectedMusic = newTheme;
  };
}

export default GameMusic;

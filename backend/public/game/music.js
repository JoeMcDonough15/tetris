import { generateMusicPath } from "../../../utils/index.js";

class GameMusic {
  constructor(selectedTheme) {
    this.player = new Audio(generateMusicPath(selectedTheme));
    this.selectedMusic = selectedTheme;
    this.player.loop = true;
  }

  changeMusic = (newTheme) => {
    this.player.src = generateMusicPath(newTheme);
    this.selectedMusic = newTheme;
  };

  endMusic = () => {
    this.player.src = "";
    this.selectedMusic = null;
  };
}

export default GameMusic;

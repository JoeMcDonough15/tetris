class Settings {
  constructor() {
    this.soundFx = "off";
    this.music = "off";
    this.gameMusicSelection = "theme-2"; // ! should be theme-1 this is for testing only
    this.colorPaletteSelection = "classic";
    this.keyControls = {
      rotate: "ArrowUp",
      moveLeft: "ArrowLeft",
      moveRight: "ArrowRight",
      softDrop: "ArrowDown",
      togglePause: "p",
    };
  }

  selectSoundFx = (onOrOff) => {
    this.soundFx = onOrOff;
  };

  selectMusic = (onOrOff) => {
    this.music = onOrOff;
  };

  selectGameMusic = (musicChoice) => {
    this.gameMusicSelection = musicChoice;
  };

  selectColorPalette = (colorPaletteChoice) => {
    this.colorPaletteSelection = colorPaletteChoice;
  };

  selectKeyControls = (newKeyControls) => {
    this.keyControls = newKeyControls;
  };

  updateSettings = ({
    soundFx,
    music,
    gameMusicSelection,
    colorPaletteSelection,
    keyControls,
  }) => {
    this.selectSoundFx(soundFx);
    this.selectMusic(music);
    this.selectGameMusic(gameMusicSelection);
    this.selectColorPalette(colorPaletteSelection);
    this.selectKeyControls(keyControls);
  };
}

export default Settings;

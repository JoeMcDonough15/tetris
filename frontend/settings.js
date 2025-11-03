class Settings {
  constructor() {
    this.savedSettings = JSON.parse(
      window.sessionStorage.getItem("savedSettings") // possibly null
    );
    this.soundFx = this.savedSettings?.soundFx || "on";
    this.music = this.savedSettings?.music || "on";
    this.gameMusicSelection =
      this.savedSettings?.gameMusicSelection || "theme-1";
    this.colorPaletteSelection =
      this.savedSettings?.colorPaletteSelection || "classic";
    this.keyControls = this.savedSettings?.keyControls || {
      rotate: "ArrowUp",
      moveLeft: "ArrowLeft",
      moveRight: "ArrowRight",
      softDrop: "ArrowDown",
      togglePause: "p",
    };
  }

  turnSoundFxOn = () => {
    this.soundFx = "on";
  };

  turnSoundFxOff = () => {
    this.soundFx = "off";
  };

  turnMusicOn = () => {
    this.music = "on";
  };

  turnMusicOff = () => {
    this.music = "off";
  };

  selectGameMusic = (musicChoice) => {
    this.gameMusicSelection = musicChoice;
  };

  selectColorPalette = (colorPaletteChoice) => {
    this.colorPaletteSelection = colorPaletteChoice;
  };

  changeKeyControl = (keyToChange, newKeyChoice) => {
    this.keyControls[keyToChange] = newKeyChoice;
  };

  updateSettings = ({
    updateSoundFxOnOff,
    updateMusicOnOff,
    updateGameMusicSelection,
    updateColorPaletteSelection,
    updatedKeyControlValues,
  }) => {
    // Update All Settings
    if (updateSoundFxOnOff === "on") {
      this.turnSoundFxOn();
    } else {
      this.turnSoundFxOff();
    }
    if (updateMusicOnOff === "on") {
      this.turnMusicOn();
    } else {
      this.turnMusicOff();
    }
    this.selectGameMusic(updateGameMusicSelection);
    this.selectColorPalette(updateColorPaletteSelection);

    Object.keys(this.keyControls).forEach((keyControl, index) => {
      const updatedValue = updatedKeyControlValues[index];
      this.changeKeyControl(keyControl, updatedValue);
    });

    const settingsJson = JSON.stringify({
      soundFx: this.soundFx,
      music: this.music,
      gameMusicSelection: this.gameMusicSelection,
      colorPaletteSelection: this.colorPaletteSelection,
      keyControls: this.keyControls,
    });

    // save our newly updated settings to session storage
    window.sessionStorage.setItem("savedSettings", settingsJson);
  };
}

export default Settings;

class Settings {
  constructor(settingsModal, updateSettingsForm, savedSettings) {
    this.settingsModal = settingsModal;
    this.updateSettingsForm = updateSettingsForm;
    this.soundFx = savedSettings?.soundFx || "on";
    this.music = savedSettings?.music || "on";
    this.gameMusicSelection = savedSettings?.gameMusicSelection || "theme-1";
    this.colorPaletteSelection =
      savedSettings?.colorPaletteSelection || "classic";
    this.keyControls = savedSettings?.keyControls || {
      rotate: "ArrowUp",
      moveLeft: "ArrowLeft",
      moveRight: "ArrowRight",
      softDrop: "ArrowDown",
      togglePause: "p",
    };

    this.listenForSettingsUpdates();
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

  listenForSettingsUpdates = () => {
    this.updateSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.updateSettings();
    });
  };

  updateSettings = () => {
    const updateSoundFx = this.updateSettingsForm.elements.soundFx.value;
    const updateMusicOnOff = this.updateSettingsForm.elements.music.value;
    const updateGameMusicSelection =
      this.updateSettingsForm.elements.gameMusicSelection.value;
    const updateColorPaletteSelection =
      this.updateSettingsForm.elements.colorPaletteSelection.value;
    const updateRotateControl = this.updateSettingsForm.elements.rotate.value;
    const updateMoveLeft = this.updateSettingsForm.elements.moveLeft.value;
    const updateMoveRight = this.updateSettingsForm.elements.moveRight.value;
    const updateSoftDrop = this.updateSettingsForm.elements.softDrop.value;
    const updateTogglePause =
      this.updateSettingsForm.elements.togglePause.value;
    const updatedKeyControlValues = [
      updateRotateControl,
      updateMoveLeft,
      updateMoveRight,
      updateSoftDrop,
      updateTogglePause,
    ];

    if (updateSoundFx === "on") {
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
    this.settingsModal.close();
  };
}

export default Settings;

class Settings {
  constructor(settingsModal, updateSettingsForm, savedSettings) {
    this.settingsModal = settingsModal;
    this.updateSettingsForm = updateSettingsForm;
    this.soundFx = savedSettings?.soundFx || "on";
    this.music = savedSettings?.music || "on";
    this.gameMusicSelection = savedSettings?.gameMusicSelection || "theme-1";
    this.colorPalette = savedSettings?.colorPalette || "classic";
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

  listenForSettingsUpdates = () => {
    this.updateSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.updateSettings();
    });
  };

  updateSettings = () => {
    const updateSoundFx = this.updateSettingsForm.elements.soundFx.value;
    if (updateSoundFx === "on") {
      this.turnSoundFxOn();
    } else {
      this.turnSoundFxOff();
    }

    const settingsJson = JSON.stringify({
      soundFx: this.soundFx,
    });

    // save our newly updated settings to session storage
    window.sessionStorage.setItem("savedSettings", settingsJson);
    this.settingsModal.close();
  };
}

export default Settings;

class Settings {
  constructor(settingsModal, updateSettingsForm, savedSettings) {
    this.settingsModal = settingsModal;
    this.updateSettingsForm = updateSettingsForm;
    this.soundFx = savedSettings?.soundFx || "on";
    this.listenForSettingsUpdates();
    // music - off or on
    // music selection for in game play
    // color scheme
    // player controls
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

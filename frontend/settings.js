class Settings {
  constructor(updateSettingsForm, savedSettings) {
    this.updateSettingsForm = updateSettingsForm;
    this.soundFx = savedSettings?.soundFx || "on";
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

  prepareUpdateSettingsForm = () => {
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
  };
}

export default Settings;

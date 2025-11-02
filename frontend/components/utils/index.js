const savedSettings = JSON.parse(
  window.sessionStorage.getItem("savedSettings")
);

// UI Helpers

// create any element with any number of classes and an optional id
export const quickElement = (elementName, classes, id = null) => {
  const element = document.createElement(elementName);
  if (id) element.setAttribute("id", id);
  if (classes.length) element.classList.add(...classes);
  return element;
};

// create one menu button that wraps either a navigation link or a span
export const createMenuButton = (buttonObj) => {
  const button = quickElement("button", ["menu-button"], buttonObj.id);
  const buttonContent = quickElement(buttonObj.navLink ? "a" : "span", []);
  buttonContent.innerText = buttonObj.buttonText;
  if (buttonObj.navLink) {
    buttonContent.setAttribute("href", buttonObj.navLink);
  }
  button.appendChild(buttonContent);
  return button;
};

// create a div element with a label and input
export const createInputContainer = (data, customValue = null) => {
  const inputContainer = quickElement("div", data.containerClasses);
  const label = quickElement("label", []);
  label.innerText = data.labelText;
  label.setAttribute("for", data.input.id);
  const input = quickElement("input", [], data.input.id);
  const attributes = Object.keys(data.input);
  attributes.forEach((attribute) => {
    input.setAttribute(attribute, data.input[attribute]);
  });

  if (data.input.type === "radio") {
    if (
      (savedSettings && savedSettings[data.input.name] === data.input.value) ||
      data.input.value === "on" ||
      data.input.value === "theme-1"
    ) {
      input.setAttribute("checked", true);
    }
  }

  if (customValue) {
    input.value = customValue;
  }

  inputContainer.append(label, input);
  return inputContainer;
};

export const createSubmitButton = (buttonObj) => {
  const submit = quickElement("button", [], buttonObj.id);
  submit.setAttribute("type", "submit");
  submit.innerText = buttonObj.buttonText;
  return submit;
};

export const createRadioOptions = (data) => {
  const radioOptionsFieldSet = quickElement(
    "fieldset",
    data.fieldSetOptions.containerClasses
  );
  const radioOptionsLegend = quickElement(
    "legend",
    data.fieldSetOptions.legendClasses
  );
  radioOptionsLegend.innerText = data.fieldSetOptions.legendText;

  const radioOptions = quickElement("div", ["radio-options-container"]);

  const radios = data.radioOptions.map((radioOption) =>
    createInputContainer(radioOption)
  );

  radioOptions.append(...radios);

  radioOptionsFieldSet.append(radioOptionsLegend, radioOptions);
  return radioOptionsFieldSet;
};

// render a preview image of the next piece in the game queue
export const createPreviewImg = (id) => {
  const previewImg = quickElement("img", [id], id);
  previewImg.setAttribute("src", ""); // src will be assigned inside the instance method setPreviewOfNextPiece
  previewImg.setAttribute("alt", `${id} of next shape`);
  return previewImg;
};

// UI Data
export const updateSettingsFormData = {
  settingsOptions: {
    musicOnOff: {
      fieldSetOptions: {
        containerClasses: [],
        legendText: "Music",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "On",
          input: { id: "music-on", type: "radio", name: "music", value: "on" },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Off",
          input: {
            id: "music-off",
            type: "radio",
            name: "music",
            value: "off",
          },
        },
      ],
    },
    musicSelect: {
      fieldSetOptions: {
        containerClasses: [],
        legendText: "Music Theme",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "Theme One",
          input: {
            id: "music-theme-one",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-1",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Theme Two",
          input: {
            id: "music-theme-two",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-2",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Theme Three",
          input: {
            id: "music-theme-three",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-3",
          },
        },
      ],
    },
    colorPaletteSelect: {
      fieldSetOptions: {
        containerClasses: [],
        legendText: "Color Palette",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "Classic",
          input: {
            id: "color-palette-classic",
            type: "radio",
            name: "colorPaletteSelection",
            value: "classic",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Two",
          input: {
            id: "color-palette-two",
            type: "radio",
            name: "colorPaletteSelection",
            value: "two",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Three",
          input: {
            id: "color-palette-three",
            type: "radio",
            name: "colorPaletteSelection",
            value: "three",
          },
        },
      ],
    },
    keyControls: {},
    soundFxOnOff: {
      fieldSetOptions: {
        containerClasses: [],
        legendText: "Sound FX",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "On",
          input: {
            id: "sound-fx-on",
            type: "radio",
            name: "soundFx",
            value: "on",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Off",
          input: {
            id: "sound-fx-off",
            type: "radio",
            name: "soundFx",
            value: "off",
          },
        },
      ],
    },
  },
  submitButtonText: "Apply Settings",
};

export const highScoresFormData = {
  playerName: {
    containerClasses: [],
    labelText: "Enter your name",
    input: {
      id: "player-name",
      type: "text",
      name: "player-name",
      required: true,
      maxLength: 18,
    },
  },
  playerScore: {
    containerClasses: ["player-score-container"],
    labelText: "Your Score",
    input: {
      id: "player-score",
      type: "text",
      name: "player-score",
      readonly: true,
    },
  },
};

export const highScoresTableFields = ["No.", "Player", "Score"];

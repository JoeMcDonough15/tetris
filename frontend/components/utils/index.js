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
export const createInputContainer = (data) => {
  const inputContainer = quickElement("div", data.containerClasses);
  const label = quickElement("label", []);
  label.innerText = data.labelText;
  label.setAttribute("for", data.input.id);
  const input = quickElement("input", [], data.input.id);
  const attributes = Object.keys(data.input);
  attributes.forEach((attribute) => {
    input.setAttribute(attribute, data.input[attribute]);
  });

  inputContainer.append(label, input);
  return inputContainer;
};

export const createSubmitButton = (buttonObj) => {
  const submit = quickElement("button", buttonObj.classes, buttonObj.id);
  submit.setAttribute("type", "submit");
  submit.innerText = buttonObj.buttonText;
  return submit;
};

export const createRadioOptions = (data) => {
  const radioOptionsFieldSet = quickElement(
    "fieldset",
    data.fieldSetOptions.containerClasses,
    data.fieldSetOptions.fieldSetId
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
        fieldSetId: "music-on-off",
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
        fieldSetId: "music-select",
        containerClasses: [],
        legendText: "Select Game Music",
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
        fieldSetId: "color-palette-select",
        containerClasses: [],
        legendText: "Select Color Palette",
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
    keyControls: {
      rotate: {
        containerClasses: [],
        labelText: "Rotate Shape",
        input: {
          id: "key-control-rotate",
          type: "text",
          name: "rotate",
          required: true,
        },
      },
      moveLeft: {
        containerClasses: [],
        labelText: "Move Left",
        input: {
          id: "key-control-move-left",
          type: "text",
          name: "moveLeft",
          required: true,
        },
      },
      moveRight: {
        containerClasses: [],
        labelText: "Move Right",
        input: {
          id: "key-control-move-right",
          type: "text",
          name: "moveRight",
          required: true,
        },
      },
      softDrop: {
        containerClasses: [],
        labelText: "Soft Drop Shape",
        input: {
          id: "key-control-soft-drop",
          type: "text",
          name: "softDrop",
          required: true,
        },
      },
      togglePause: {
        containerClasses: [],
        labelText: "Pause/Unpause Game",
        input: {
          id: "key-control-toggle-pause",
          type: "text",
          name: "togglePause",
          required: true,
        },
      },
    },
    soundFxOnOff: {
      fieldSetOptions: {
        fieldSetId: "sound-fx-on-off",
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
  formContainerClasses: ["player-name-form", "no-display"],
  formContainerId: "player-name-form",
  playerName: {
    containerClasses: [],
    labelText: "Enter your name",
    input: {
      id: "player-name",
      type: "text",
      name: "playerName",
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
      name: "playerScore",
      readonly: true,
    },
  },
};

export const highScoresTableFields = ["No.", "Player", "Score"];

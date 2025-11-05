import {
  highScoresFormData,
  highScoresTableFields,
  loadGameFormData,
  loadGameModalObj,
  pauseMenuButtonObjs,
  pauseMenuButtonsContainerObj,
  pauseModalObj,
  saveGameFormData,
  saveGameModalObj,
  updateSettingsFormData,
} from "../utils/index.js";

// * Component Helper Functions

// create any element with any number of classes and an optional id
const quickElement = (elementName, classes, id = null) => {
  const element = document.createElement(elementName);
  if (id) element.setAttribute("id", id);
  if (classes.length) element.classList.add(...classes);
  return element;
};

// create one menu button that wraps either a navigation link or a span
const createMenuButton = (buttonObj) => {
  const button = quickElement("button", ["menu-button"], buttonObj.id);
  if (buttonObj.autofocus) {
    button.setAttribute("autofocus", true);
  }
  const buttonContent = quickElement(buttonObj.navLink ? "a" : "span", []);
  buttonContent.innerText = buttonObj.buttonText;
  if (buttonObj.navLink) {
    buttonContent.setAttribute("href", buttonObj.navLink);
  }
  button.appendChild(buttonContent);
  return button;
};

// create a div element with a label and input
const createInputContainer = (data, isSelect = null) => {
  const inputContainer = quickElement("div", data.containerClasses);
  const label = quickElement("label", []);
  label.innerText = data.labelText;
  label.setAttribute("for", data.input.id);
  const input = quickElement(isSelect ? "select" : "input", [], data.input.id);
  if (isSelect) {
    const dropDownInstructions = createGameToLoadOption(
      "Select a Game To Load"
    );
    dropDownInstructions.classList.remove("game-to-load-select-option");
    input.appendChild(dropDownInstructions);
  }

  const attributes = Object.keys(data.input);
  attributes.forEach((attribute) => {
    input.setAttribute(attribute, data.input[attribute]);
  });

  inputContainer.append(label, input);
  return inputContainer;
};

const createSubmitButton = (buttonObj) => {
  const submit = quickElement("button", buttonObj.classes, buttonObj.id);
  submit.setAttribute("type", "submit");
  submit.innerText = buttonObj.buttonText;
  return submit;
};

const createErrorMessage = (errorText, id) => {
  const error = quickElement("p", ["error-message", "no-display"], id);
  error.innerText = errorText;

  return error;
};

const createLoadGameForm = () => {
  const loadGameForm = quickElement(
    "form",
    loadGameFormData.formContainerClasses,
    loadGameFormData.formContainerId
  );
  const selectInputContainer = createInputContainer(
    loadGameFormData.inputs[0],
    "isSelect"
  );
  const submitButton = createSubmitButton(loadGameFormData.submitButton);
  const error = createErrorMessage(
    "Please Select a Game To Load",
    "no-game-selected-error-message"
  );
  loadGameForm.append(selectInputContainer, submitButton, error);
  return loadGameForm;
};

const createSaveGameForm = () => {
  const saveGameForm = quickElement(
    "form",
    saveGameFormData.formContainerClasses,
    saveGameFormData.formContainerId
  );
  const nameOfGameInputContainer = createInputContainer(
    saveGameFormData.inputs[0]
  );
  const submitButton = createSubmitButton(saveGameFormData.submitButton);

  saveGameForm.append(nameOfGameInputContainer, submitButton);
  return saveGameForm;
};

const createRadioOptions = (data) => {
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
const createPreviewImg = (id) => {
  const previewImg = quickElement("img", [id], id);
  previewImg.setAttribute("src", ""); // src will be assigned inside the instance method setPreviewOfNextPiece
  previewImg.setAttribute("alt", `${id} of next shape`);
  return previewImg;
};

// render a form to put inside the settingsModal in order to update settings
const createUpdateSettingsForm = () => {
  const updateSettingsForm = quickElement("form", [], "update-settings-form");
  const soundFxOnOffOptions = createRadioOptions(
    updateSettingsFormData.settingsOptions.soundFxOnOff
  );
  const musicOnOffOptions = createRadioOptions(
    updateSettingsFormData.settingsOptions.musicOnOff
  );
  const musicSelectOptions = createRadioOptions(
    updateSettingsFormData.settingsOptions.musicSelect
  );
  const colorPaletteSelectOptions = createRadioOptions(
    updateSettingsFormData.settingsOptions.colorPaletteSelect
  );
  const keyControlSelectOptionsContainer = quickElement("div", []);

  const keyControlSelectOptions = Object.values(
    updateSettingsFormData.settingsOptions.keyControls
  ).map((keyControlObj) => createInputContainer(keyControlObj));

  keyControlSelectOptionsContainer.append(...keyControlSelectOptions);

  const submitButton = createSubmitButton({
    id: "update-settings-submit-button",
    classes: [],
    buttonText: updateSettingsFormData.submitButtonText,
  });

  const error = quickElement(
    "p",
    ["error-message", "no-display"],
    "settings-error-message"
  );
  error.innerText = "key controls must be unique!";

  updateSettingsForm.append(
    soundFxOnOffOptions,
    musicOnOffOptions,
    musicSelectOptions,
    colorPaletteSelectOptions,
    keyControlSelectOptionsContainer,
    submitButton,
    error
  );
  return updateSettingsForm;
};

const createModalWithButton = ({ closeButtonObj, classes, id }) => {
  const modal = quickElement("dialog", ["modal-container", ...classes], id);
  const closeModalButton = createCloseModalButton(closeButtonObj);
  modal.appendChild(closeModalButton);
  return modal;
};

// ? This function only gets called inside createModalWithButton.  Should it just live there?
const createCloseModalButton = ({ buttonText, classes, id }) => {
  const closeModalButton = quickElement("button", classes, id);
  closeModalButton.innerText = buttonText;
  closeModalButton.setAttribute("autofocus", true); // accessibility concern
  return closeModalButton;
};

// * Component Functions to be Exported

// render a player name form with a custom method to be called on submit
export const createPlayerNameForm = () => {
  const playerNameForm = quickElement(
    "form",
    highScoresFormData.formContainerClasses,
    highScoresFormData.formContainerId
  );
  const playerNameContainer = createInputContainer(
    highScoresFormData.playerName
  );
  const playerScoreContainer = createInputContainer(
    highScoresFormData.playerScore
  );
  const submitButton = createSubmitButton({
    buttonText: "Submit",
    classes: [],
  });
  playerNameForm.append(
    playerNameContainer,
    playerScoreContainer,
    submitButton
  );
  return playerNameForm;
};

// render a table of existing high scores
export const createHighScoresTable = (highScores) => {
  const highScoresTable = quickElement("table", []);
  const highScoresTableHeader = quickElement("thead", []);
  const highScoresTableHeaderRow = quickElement("tr", []);

  highScoresTableFields.forEach((fieldName) => {
    const fieldDataCell = quickElement("td", []);
    fieldDataCell.innerText = fieldName;
    highScoresTableHeaderRow.appendChild(fieldDataCell);
  });
  highScoresTableHeader.appendChild(highScoresTableHeaderRow);
  const highScoresTableBody = quickElement("tbody", []);
  highScores.forEach((scoreObj, indexOfObj) => {
    const highScoreBodyRow = quickElement("tr", []);
    for (let i = 0; i < highScoresTableFields.length; i++) {
      const fieldDataCell = quickElement("td", []);
      if (i === 0) {
        fieldDataCell.innerText = (indexOfObj + 1).toString();
      } else if (i === 1) {
        fieldDataCell.innerText = scoreObj.name;
      } else {
        fieldDataCell.innerText = scoreObj.score;
      }
      highScoreBodyRow.appendChild(fieldDataCell);
    }

    highScoresTableBody.appendChild(highScoreBodyRow);
  });
  highScoresTable.append(highScoresTableHeader, highScoresTableBody);
  return highScoresTable;
};

// render a customizable heading of any level for use anywhere
export const createCustomHeading = (headingLevel, headingText, classes, id) => {
  const headingElement = quickElement(headingLevel, classes, id);
  headingElement.innerText = headingText;
  return headingElement;
};

// render a custom container element with any number of classes and an optional id
export const createContainer = (elementName, classes, id = null) => {
  const container = quickElement(elementName, classes, id);
  return container;
};

// render a container of menu buttons consisting of nav buttons first then any other menu buttons
export const createMenuButtons = (containerObj, arrayOfButtonObjs) => {
  const menuButtonsContainer = quickElement(
    containerObj.elementName,
    containerObj.classes,
    containerObj.id
  );
  // create nav buttons and place in their own separate nav tag
  const navButtonsContainer = quickElement("nav", ["nav-buttons"]);
  const navButtons = arrayOfButtonObjs
    .filter((buttonObj) => buttonObj.navLink)
    .map((buttonObj) => createMenuButton(buttonObj));
  navButtonsContainer.append(...navButtons);

  // create all non-nav buttons
  const menuButtons = arrayOfButtonObjs
    .filter((buttonObj) => !buttonObj.navLink)
    .map((buttonObj) => createMenuButton(buttonObj));

  menuButtonsContainer.append(navButtonsContainer, ...menuButtons);

  return menuButtonsContainer;
};

// render a canvas element for the game
export const createCanvas = () => {
  const canvas = quickElement("canvas", [], "canvas");
  return canvas;
};

// render a section of n sub headers
export const createSubHeaders = (typeOfHeaders, headerObjs) => {
  const subHeadersContainer = quickElement("div", ["sub-headers-container"]);

  headerObjs.forEach((headerObj) => {
    // make a header and append it to the subHeadersContainer
    const header = quickElement(typeOfHeaders, [headerObj.id], headerObj.id); // h3
    header.innerText = headerObj.headerText;
    subHeadersContainer.append(header);
  });
  return subHeadersContainer;
};

// render a preview image container for the preview image
export const createPreviewImgContainer = (className) => {
  const previewImgContainer = quickElement("div", [className]);
  const previewImg = createPreviewImg("preview-img");
  previewImgContainer.appendChild(previewImg);
  return previewImgContainer;
};

// render a controller container for the controller rows
export const createControllerContainer = () => {
  const controllerContainer = quickElement("div", ["controller-container"]);
  return controllerContainer;
};

// render a row of user controls for click events
export const createControllerRow = (containerClassName, controllerObjs) => {
  const controllerRow = quickElement("div", [containerClassName]);

  controllerObjs.forEach((controllerObj) => {
    const button = quickElement(
      "button",
      ["controller-button"],
      controllerObj.id
    );
    const buttonImage = quickElement("img", ["button-icon"]);
    buttonImage.setAttribute("src", controllerObj.imageSrc);
    buttonImage.setAttribute("alt", controllerObj.imageAltText);
    button.appendChild(buttonImage);
    controllerRow.appendChild(button);
  });
  return controllerRow;
};

// render a settings modal that can be used as a dialog element for whenever user opens settings in main menu or from the pause menu during game play
export const createSettingsModal = (settingsDataObj) => {
  const settingsModal = createModalWithButton(settingsDataObj);
  const updateSettingsForm = createUpdateSettingsForm();
  settingsModal.append(updateSettingsForm);
  return settingsModal;
};

// render a modal that has a form to select which game to load.  Game names are pulled from localStorage, and on submit, user is redirected to /play-game with the loaded game state
export const createLoadGameModal = () => {
  const loadGameModal = createModalWithButton(loadGameModalObj);
  const loadGameForm = createLoadGameForm();
  loadGameModal.appendChild(loadGameForm);
  return loadGameModal;
};

// render a modal that has a form to save your game to localStorage
export const createSaveGameModal = () => {
  const saveGameModal = createModalWithButton(saveGameModalObj);
  const saveGameForm = createSaveGameForm();
  saveGameModal.appendChild(saveGameForm);
  return saveGameModal;
};

// render options to populate the dropdown inside gameToLoadForm.  This is done using local storage inside /frontend/utils/index.js --> openLoadGameModal
export const createGameToLoadOption = (optionName) => {
  const optionElement = quickElement("option", ["game-to-load-select-option"]);
  optionElement.value = optionName;
  optionElement.innerText = optionName;
  return optionElement;
};

// render a pause modal that can be used as a dialog element for whenever user pauses the game during game play
export const createPauseModal = () => {
  const pauseModal = quickElement(
    "dialog",
    pauseModalObj.classes,
    pauseModalObj.id
  );
  const pauseMenuButtons = createMenuButtons(
    pauseMenuButtonsContainerObj,
    pauseMenuButtonObjs
  );
  pauseModal.appendChild(pauseMenuButtons);

  return pauseModal;
};

// render a row of buttons to act as the deny or confirm buttons in a confirmationModal
const createConfirmationButtonsContainer = ({
  containerClasses,
  deny,
  confirm,
}) => {
  const buttonsContainer = createContainer("div", containerClasses);

  const buttonDeny = quickElement("button", deny.classes, deny.id);
  buttonDeny.innerText = deny.buttonText;

  const buttonConfirm = quickElement("button", confirm.classes, confirm.id);
  buttonConfirm.innerText = confirm.buttonText;

  [buttonDeny, buttonConfirm].forEach((button) => {
    button.type = "button";
  });

  buttonsContainer.append(buttonDeny, buttonConfirm);

  return buttonsContainer;
};

// render a modal to confirm an action like overwriting a game in memory, or quitting a game from the pause menu
export const createConfirmationModal = ({
  classes,
  id,
  confirmationTextObj,
  confirmationButtonsObj,
}) => {
  const confirmationModal = quickElement("dialog", classes, id);
  const confirmationTextElement = quickElement(
    "p",
    confirmationTextObj.classes,
    confirmationTextObj.id
  );
  // if the confirmationText object includes
  if (confirmationTextObj.text) {
    confirmationTextElement.innerText = confirmationTextObj.text;
  }
  const confirmationButtonsContainer = createConfirmationButtonsContainer(
    confirmationButtonsObj
  );

  confirmationModal.append(
    confirmationTextElement,
    confirmationButtonsContainer
  );

  return confirmationModal;
};

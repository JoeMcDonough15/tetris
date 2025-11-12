import {
  GRID_SPACE,
  highScoresFormData,
  highScoresTableFields,
  loadGameFormData,
  loadGameModalObj,
  NUM_COLS,
  NUM_ROWS,
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
  const buttonContent = quickElement("span", []);
  buttonContent.innerText = buttonObj.buttonText;
  button.appendChild(buttonContent);
  return button;
};

// create a div element with a label and input
const createInputContainer = (data, isSelect = null) => {
  const inputContainer = quickElement(
    "div",
    data.containerClasses,
    data.containerId
  );
  const label = quickElement("label", []);
  label.innerText = data.labelText;
  label.setAttribute("for", data.input.id);
  const input = quickElement(isSelect ? "select" : "input", [], data.input.id);
  if (isSelect) {
    const dropDownInstructions = createGameToLoadOption("Saved Games");
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

// render a row of buttons to act as the cancel or confirm buttons in a confirmationModal or delete buttons in the loadGameForm
const createButtons = ({ containerClasses, buttonObjs }) => {
  const buttonsContainer = createContainer("div", containerClasses);

  buttonObjs.forEach((buttonObj) => {
    const button = quickElement("button", buttonObj.classes, buttonObj.id);
    button.innerText = buttonObj.buttonText;
    button.type = "button";

    buttonsContainer.appendChild(button);
  });

  return buttonsContainer;
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
  const deleteButtons = createButtons(loadGameFormData.deleteButtons);
  const submitButton = createSubmitButton(loadGameFormData.submitButton);
  const error = createErrorMessage(
    "Please Select a Game To Load",
    "no-game-selected-error-message"
  );
  loadGameForm.append(selectInputContainer, deleteButtons, submitButton, error);
  return loadGameForm;
};

const createSaveGameForm = () => {
  const saveGameForm = quickElement(
    "form",
    saveGameFormData.formContainerClasses,
    saveGameFormData.formContainerId
  );
  const selectInputContainer = createInputContainer(
    loadGameFormData.inputs[0],
    "isSelect"
  );

  const nameOfGameInputContainer = createInputContainer(
    saveGameFormData.inputs[0]
  );
  const submitButton = createSubmitButton(saveGameFormData.submitButton);

  saveGameForm.append(
    selectInputContainer,
    nameOfGameInputContainer,
    submitButton
  );
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

// render a custom error message for any of the components here or on the fly throughout the app
export const createErrorMessage = (errorText, id) => {
  const error = quickElement("p", ["error-message", "no-display"], id);
  error.innerText = errorText;

  return error;
};

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
  const highScoresTable = quickElement("table", ["high-scores-table"]);
  const highScoresTableHeader = quickElement("thead", []);
  const highScoresTableHeaderRow = quickElement("tr", []);

  highScoresTableFields.forEach((fieldName) => {
    const fieldDataCell = quickElement("td", ["high-scores-table-heading"]);
    fieldDataCell.innerText = fieldName;
    highScoresTableHeaderRow.appendChild(fieldDataCell);
  });
  highScoresTableHeader.appendChild(highScoresTableHeaderRow);
  const highScoresTableBody = quickElement("tbody", []);
  highScores.forEach((scoreObj, indexOfObj) => {
    const highScoreBodyRow = quickElement("tr", []);
    for (let i = 0; i < highScoresTableFields.length; i++) {
      const fieldDataCell = quickElement("td", ["high-scores-table-field"]);
      if (i === 0) {
        fieldDataCell.innerText = (indexOfObj + 1).toString();
        fieldDataCell.classList.add("high-scores-number-field");
      } else if (i === 1) {
        fieldDataCell.innerText = scoreObj.name;
      } else {
        fieldDataCell.innerText = scoreObj.score;
        fieldDataCell.classList.add("high-scores-number-field");
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

export const createImage = ({
  containerClasses,
  containerId,
  imageClasses,
  imageId,
  imageSrc,
  imageAltText,
}) => {
  const container = createContainer("div", containerClasses, containerId);
  const image = quickElement("img", imageClasses, imageId);
  image.src = imageSrc;
  image.alt = imageAltText;
  container.appendChild(image);
  return container;
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
    .filter((buttonObj) => buttonObj.navButton)
    .map((buttonObj) => createMenuButton(buttonObj));
  navButtonsContainer.append(...navButtons);

  // create all non-nav buttons
  const menuButtons = arrayOfButtonObjs
    .filter((buttonObj) => !buttonObj.navButton)
    .map((buttonObj) => createMenuButton(buttonObj));

  menuButtonsContainer.append(navButtonsContainer, ...menuButtons);

  return menuButtonsContainer;
};

// render a canvas element for the game
export const createCanvas = () => {
  const canvas = quickElement("canvas", [], "canvas");
  canvas.width = NUM_COLS * GRID_SPACE;
  canvas.height = NUM_ROWS * GRID_SPACE;

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
  settingsModal.setAttribute("closedby", "none");
  const updateSettingsForm = createUpdateSettingsForm();
  settingsModal.append(updateSettingsForm);
  return settingsModal;
};

// render a modal that has a form to select which game to load.  Game names are pulled from localStorage, and on submit, user is redirected to /play-game with the loaded game state
export const createLoadGameModal = () => {
  const loadGameModal = createModalWithButton(loadGameModalObj);
  loadGameModal.setAttribute("closedby", "none");
  const noGamesToLoadHeading = createCustomHeading(
    "h2",
    "No Saved Games",
    ["no-games-to-display-heading"],
    "no-saved-games-heading"
  );
  const loadGameForm = createLoadGameForm();
  loadGameModal.append(noGamesToLoadHeading, loadGameForm);
  return loadGameModal;
};

// render a modal that has a form to save your game to localStorage
export const createSaveGameModal = () => {
  const saveGameModal = createModalWithButton(saveGameModalObj);
  saveGameModal.setAttribute("closedby", "none");
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
  pauseModal.setAttribute("closedby", "none");
  const pauseMenuButtons = createMenuButtons(
    pauseMenuButtonsContainerObj,
    pauseMenuButtonObjs
  );
  pauseModal.appendChild(pauseMenuButtons);

  return pauseModal;
};

// ! should not need this now
// export const createConfirmationModal = ({
//   classes,
//   id,
//   confirmationTextObj,
//   confirmationButtonsObj,
// }) => {
//   const confirmationModal = quickElement("dialog", classes, id);
//   confirmationModal.setAttribute("closedby", "none");
//   const confirmationTextElement = quickElement(
//     "p",
//     confirmationTextObj.classes,
//     confirmationTextObj.id
//   );
//   // if the confirmationText object includes
//   if (confirmationTextObj.text) {
//     confirmationTextElement.innerText = confirmationTextObj.text;
//   }

//   const confirmationButtonsContainer = createButtons(confirmationButtonsObj);

//   confirmationModal.append(
//     confirmationTextElement,
//     confirmationButtonsContainer
//   );

//   return confirmationModal;
// };

// render a modal to confirm an action like overwriting a game in memory, or quitting a game from the pause menu
export const createConfirmationModal = () => {
  const confirmationModal = quickElement(
    "dialog",
    ["modal-container"],
    "confirmation-modal"
  );
  confirmationModal.setAttribute("closedby", "none");

  return confirmationModal;
};

export const createConfirmationModalContent = ({
  containerClasses,
  containerId,
  confirmationTextObj,
  confirmationButtonsObj,
}) => {
  const modalContentContainer = quickElement(
    "div",
    containerClasses,
    containerId
  );

  const confirmationTextElement = quickElement(
    "p",
    confirmationTextObj.classes,
    confirmationTextObj.id
  );
  // if the confirmationText object includes hard coded text to put on it, do so; otherwise, the text is generated dynamically using its confirmationTextElement.id inside an event listener.
  if (confirmationTextObj.text) {
    confirmationTextElement.innerText = confirmationTextObj.text;
  }

  const confirmationButtonsContainer = createButtons(confirmationButtonsObj);

  modalContentContainer.append(
    confirmationTextElement,
    confirmationButtonsContainer
  );

  return modalContentContainer; // in the event listner to open this, confirmationModal.appendChild(modalContentContainer);
  // in the event listener to close this modal, it would confirmationModal.close() and then modalContentContainer.remove();
};

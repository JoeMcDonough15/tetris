import {
  createInputContainer,
  createMenuButton,
  createPreviewImg,
  createRadioOptions,
  createSubmitButton,
  highScoresFormData,
  highScoresTableFields,
  quickElement,
  updateSettingsFormData,
} from "./utils/index.js";

// const savedSettings = JSON.parse(
//   window.sessionStorage.getItem("savedSettings")
// );

// render a player name form with a custom method to be called on submit
export const createPlayerNameForm = (methodForSubmit, playerScore) => {
  // ! Why do we need these lines that remove an existing form?
  const existingForm = document.getElementById("player-name-form");
  if (existingForm) {
    existingForm.remove();
  }
  const playerNameForm = quickElement("form", [], "player-name-form");
  playerNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    methodForSubmit();
  });
  const playerNameContainer = createInputContainer(highScoresFormData);
  const playerScoreContainer = createInputContainer(
    highScoresFormData,
    playerScore
  );
  const submitButton = createSubmitButton({ buttonText: "Submit" });
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
export const createCustomHeading = (headingLevel, headingText, ...classes) => {
  const headingElement = quickElement(headingLevel, classes);
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

// render a form to put inside the settingsModal in order to update settings
const createUpdateSettingsForm = () => {
  const updateSettingsForm = quickElement("form", [], "update-settings-form");
  const soundFxOptions = createRadioOptions(
    updateSettingsFormData.settingsOptions.soundFxOnOff
  );
  const submitButton = createSubmitButton({
    id: "update-settings-submit-button",
    buttonText: updateSettingsFormData.submitButtonText,
  });

  updateSettingsForm.append(soundFxOptions, submitButton);
  return updateSettingsForm;
};

// render a settings modal that can be used as a dialog element for whenever user opens settings in main menu or pauses game during game play
export const createSettingsModal = (closeModalButtonText) => {
  const settingsModal = quickElement(
    "dialog",
    ["settings-modal-container"],
    "settings-modal"
  );
  const updateSettingsForm = createUpdateSettingsForm();
  const closeModalButton = quickElement("button", [], "close-modal-button");
  // TODO once the pause menu is built, return the close modal event listener to this component; remove that
  // TODO event listener from the /index.js and /play-game/index.js

  // ? This is because, as of now, the close modal functionality also has to close the pause menu in play-game/index.js which
  // ? is why it was removed from here and defined inside play-game/index.js
  closeModalButton.innerText = closeModalButtonText;
  closeModalButton.setAttribute("autofocus", true);
  settingsModal.append(closeModalButton, updateSettingsForm);

  return settingsModal;
};

import { highScoresFormData, highScoresTableFields } from "../utils/index.js";
import {
  createInputContainer,
  createMenuButton,
  createPreviewImg,
  createSubmitButton,
  createUpdateSettingsForm,
  quickElement,
} from "./utils/index.js";

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

// render a settings modal that can be used as a dialog element for whenever user opens settings in main menu or pauses game during game play
export const createSettingsModal = (closeModalButtonText) => {
  const settingsModal = quickElement(
    "dialog",
    ["settings-modal-container"],
    "settings-modal"
  );
  const updateSettingsForm = createUpdateSettingsForm();
  const closeModalButton = quickElement("button", [], "close-modal-button");
  closeModalButton.innerText = closeModalButtonText;
  closeModalButton.setAttribute("autofocus", true);
  settingsModal.append(closeModalButton, updateSettingsForm);

  return settingsModal;
};

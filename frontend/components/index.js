const savedSettings = JSON.parse(
  window.sessionStorage.getItem("savedSettings")
);

// render a nav container with a custom number of buttons containing nav links
export const createNavButtons = (...buttonObjs) => {
  const navButtonsContainer = document.createElement("nav");
  navButtonsContainer.classList.add("nav-buttons");

  const navButtons = buttonObjs.map((buttonObj) => {
    const navButton = document.createElement("button");
    const navLink = document.createElement("a");
    navButton.classList.add("nav-button");
    navLink.classList.add("nav-link");
    navLink.setAttribute("href", buttonObj.navDestination);
    navLink.innerText = buttonObj.buttonText;
    navButton.appendChild(navLink);

    return navButton;
  });

  navButtons.forEach((navButton) => {
    navButtonsContainer.appendChild(navButton);
  });

  return navButtonsContainer;
};

export const createMenuButton = (buttonObj) => {
  const button = document.createElement("button");
  button.classList.add("nav-button");
  const buttonContent = document.createElement("span");
  buttonContent.innerText = buttonObj.buttonText;
  buttonContent.classList.add("nav-link");
  button.appendChild(buttonContent);
  button.addEventListener("click", () => {
    buttonObj.clickEventFunction();
  });
  return button;
};

// render a player name form with a custom method to be called on submit
export const createPlayerNameForm = (methodForSubmit, playerScore) => {
  const existingForm = document.getElementById("player-name-form");
  if (existingForm) {
    existingForm.remove();
  }
  const playerNameForm = document.createElement("form");
  playerNameForm.setAttribute("id", "player-name-form");
  playerNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    methodForSubmit();
  });

  const playerNameContainer = document.createElement("div");

  const playerNameLabel = document.createElement("label");
  playerNameLabel.innerText = "Enter your name";
  playerNameLabel.setAttribute("for", "player-name");

  const playerNameInput = document.createElement("input");
  playerNameInput.setAttribute("id", "player-name");
  playerNameInput.setAttribute("type", "text");
  playerNameInput.setAttribute("name", "player-name");
  // Player Name Client-Side Validation
  playerNameInput.setAttribute("required", true);
  playerNameInput.setAttribute("maxLength", 18);

  playerNameContainer.append(playerNameLabel, playerNameInput);

  const playerScoreContainer = document.createElement("div");
  playerScoreContainer.setAttribute("style", "pointer-events: none;");
  const playerScoreLabel = document.createElement("label");
  playerScoreLabel.innerText = "Your Score";
  playerScoreLabel.setAttribute("for", "player-score");
  const playerScoreInput = document.createElement("input");
  playerScoreInput.setAttribute("id", "player-score");
  playerScoreInput.setAttribute("type", "text");
  playerScoreInput.setAttribute("name", "player-score");
  playerScoreInput.setAttribute("readonly", true);
  playerScoreInput.value = playerScore;

  playerScoreContainer.append(playerScoreLabel, playerScoreInput);

  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.innerText = "Submit";

  playerNameForm.append(
    playerNameContainer,
    playerScoreContainer,
    submitButton
  );

  return playerNameForm;
};

// render a table of existing high scores
export const createHighScoresTable = (highScores) => {
  const highScoresTable = document.createElement("table");
  const highScoresTableHeader = document.createElement("thead");
  const highScoresTableHeaderRow = document.createElement("tr");
  const tableFields = ["No.", "Player", "Score"];
  tableFields.forEach((fieldName) => {
    const fieldDataCell = document.createElement("td");
    fieldDataCell.innerText = fieldName;
    highScoresTableHeaderRow.appendChild(fieldDataCell);
  });
  highScoresTableHeader.appendChild(highScoresTableHeaderRow);
  const highScoresTableBody = document.createElement("tbody");
  highScores.forEach((scoreObj, indexOfObj) => {
    const highScoreBodyRow = document.createElement("tr");
    for (let i = 0; i < tableFields.length; i++) {
      const fieldDataCell = document.createElement("td");
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
  const headingElement = document.createElement(headingLevel);
  headingElement.innerText = headingText;
  classes.forEach((className) => {
    headingElement.classList.add(className);
  });
  return headingElement;
};

// render a main container to use for each page
export const createMainContainer = (id) => {
  const mainContainer = document.createElement("main");
  mainContainer.setAttribute("id", id);
  mainContainer.classList.add("main-container", id);
  return mainContainer;
};

// render a section element with an id and class that are the same
export const createSectionContainer = (id) => {
  const sectionContainer = document.createElement("section");
  sectionContainer.setAttribute("id", id);
  sectionContainer.classList.add(id);
  return sectionContainer;
};

// render a canvas element for the game
export const createCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  return canvas;
};

// render a section of n sub headers
export const createSubHeaders = (typeOfHeaders, ...headerObjs) => {
  const subHeadersContainer = document.createElement("div");
  subHeadersContainer.classList.add("sub-headers-container");

  headerObjs.forEach((headerObj) => {
    // make a header and append it to the subHeadersContainer
    const header = document.createElement(typeOfHeaders); // h3
    header.innerText = headerObj.headerText;
    header.setAttribute("id", headerObj.id);
    header.classList.add(headerObj.id);
    subHeadersContainer.append(header);
  });
  return subHeadersContainer;
};

// render a preview image of the next piece in the game queue
const createPreviewImg = (id) => {
  const previewImg = document.createElement("img");
  previewImg.setAttribute("src", ""); // src will be assigned inside the instance method setPreviewOfNextPiece
  previewImg.setAttribute("alt", `${id} of next shape`);
  previewImg.setAttribute("id", id);
  previewImg.classList.add(id);
  return previewImg;
};

// render a preview image container for the preview image
export const createPreviewImgContainer = (className) => {
  const previewImgContainer = document.createElement("div");
  previewImgContainer.classList.add(className);
  const previewImg = createPreviewImg("preview-img");
  previewImgContainer.appendChild(previewImg);
  return previewImgContainer;
};

// render a controller container for the controller rows
export const createControllerContainer = () => {
  const controllerContainer = document.createElement("div");
  controllerContainer.classList.add("controller-container");
  return controllerContainer;
};

// render a row of user controls for click events
export const createControllerRow = (containerClassName, ...controllerObjs) => {
  const controllerRow = document.createElement("div");
  controllerRow.classList.add(containerClassName);
  controllerObjs.forEach((controllerObj) => {
    const button = document.createElement("button");
    button.setAttribute("id", controllerObj.id);
    button.classList.add("controller-button");
    const buttonImage = document.createElement("img");
    buttonImage.setAttribute("src", controllerObj.imageSrc);
    buttonImage.setAttribute("alt", controllerObj.imageAltText);
    buttonImage.classList.add("button-icon");
    button.appendChild(buttonImage);
    controllerRow.appendChild(button);
  });
  return controllerRow;
};

// render a form to put inside the settingsModal in order to update settings
const createUpdateSettingsForm = () => {
  const updateSettingsForm = document.createElement("form");
  // the id will be used to pass a reference to this form element into the Settings object's constructor method
  updateSettingsForm.setAttribute("id", "update-settings-form");

  const soundFxContainer = document.createElement("fieldset");
  const soundFxLegend = document.createElement("legend");
  soundFxLegend.innerText = "Sound Fx";

  const soundFxOnContainer = document.createElement("div");
  const soundFxOnLabel = document.createElement("label");
  soundFxOnLabel.setAttribute("for", "sound-fx-on");
  soundFxOnLabel.innerText = "On";
  const soundFxOnRadio = document.createElement("input");
  soundFxOnRadio.setAttribute("id", "sound-fx-on");
  soundFxOnRadio.setAttribute("type", "radio");
  soundFxOnRadio.setAttribute("name", "soundFx");
  soundFxOnRadio.setAttribute("value", "on");
  // soundFxOnRadio.setAttribute("checked", true);
  soundFxOnContainer.append(soundFxOnLabel, soundFxOnRadio);

  const soundFxOffContainer = document.createElement("div");
  const soundFxOffLabel = document.createElement("label");
  soundFxOffLabel.setAttribute("for", "sound-fx-off");
  soundFxOffLabel.innerText = "Off";
  const soundFxOffRadio = document.createElement("input");
  soundFxOffRadio.setAttribute("id", "sound-fx-off");
  soundFxOffRadio.setAttribute("type", "radio");
  soundFxOffRadio.setAttribute("name", "soundFx");
  soundFxOffRadio.setAttribute("value", "off");
  soundFxOffContainer.append(soundFxOffLabel, soundFxOffRadio);

  // set checked state based on saved settings, if we have it in sessionStorage
  if (savedSettings) {
    savedSettings.soundFx === "on"
      ? soundFxOnRadio.setAttribute("checked", true)
      : soundFxOffRadio.setAttribute("checked", true);
  }

  const soundFxOnOffContainer = document.createElement("div");
  soundFxOnOffContainer.classList.add("radio-options-container");
  soundFxOnOffContainer.append(soundFxOnContainer, soundFxOffContainer);

  soundFxContainer.append(soundFxLegend, soundFxOnOffContainer);

  const submitButton = document.createElement("button");
  submitButton.setAttribute("id", "update-settings-submit-button");
  submitButton.setAttribute("type", "submit");
  submitButton.innerText = "Apply Settings";

  updateSettingsForm.append(soundFxContainer, submitButton);
  return updateSettingsForm;
};

// render a settings modal that can be used as a dialog element for whenever user opens settings in main menu or pauses game during game play
export const createSettingsModal = (closeModalButtonText) => {
  const settingsModal = document.createElement("dialog");
  settingsModal.classList.add("settings-modal");
  settingsModal.setAttribute("id", "settings-modal");
  const updateSettingsForm = createUpdateSettingsForm();
  const closeModalButton = document.createElement("button");
  closeModalButton.innerText = closeModalButtonText;
  closeModalButton.setAttribute("autofocus", true);
  closeModalButton.setAttribute("id", "close-modal-button");

  settingsModal.append(closeModalButton, updateSettingsForm);

  return settingsModal;
};

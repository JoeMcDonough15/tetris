const savedSettings = JSON.parse(
  window.sessionStorage.getItem("savedSettings")
);

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

// render a custom container element with any number of classes and an optional id
export const createContainer = (elementName, classNames, id = null) => {
  const container = document.createElement(elementName);
  if (id) container.setAttribute("id", id);
  classNames.forEach((className) => {
    container.classList.add(className);
  });
  return container;
};

// render one menu button that wraps either a navigation link or a span
const createMenuButton = (buttonObj) => {
  const button = document.createElement("button");
  if (buttonObj.id) button.setAttribute("id", buttonObj.id);
  button.classList.add("menu-button");
  const buttonContent = document.createElement(
    buttonObj.navLink ? "a" : "span"
  );
  buttonContent.innerText = buttonObj.buttonText;

  if (buttonObj.navLink) {
    buttonContent.setAttribute("href", buttonObj.navLink);
  }
  button.appendChild(buttonContent);
  return button;
};

// render a container of menu buttons consisting of nav buttons first then any other menu buttons
export const createMenuButtons = (containerObj, arrayOfButtonObjs) => {
  const menuButtonsContainer = createContainer(
    containerObj.elementName,
    containerObj.classNames,
    containerObj.id
  );
  // create nav buttons and place in their own separate nav tag
  const navButtonsContainer = createContainer("nav", ["nav-buttons"]);
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
  savedSettings && savedSettings.soundFx === "off"
    ? soundFxOffRadio.setAttribute("checked", true)
    : soundFxOnRadio.setAttribute("checked", true);

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
  // TODO once the pause menu is built, return the close modal event listener to this component; remove that
  // TODO event listener from the /index.js and /play-game/index.js

  // ? This is because, as of now, the close modal functionality also has to close the pause menu in play-game/index.js which
  // ? is why it was removed from here and defined inside play-game/index.js
  closeModalButton.innerText = closeModalButtonText;
  closeModalButton.setAttribute("autofocus", true);
  closeModalButton.setAttribute("id", "close-modal-button");

  settingsModal.append(closeModalButton, updateSettingsForm);

  return settingsModal;
};

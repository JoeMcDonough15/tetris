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

export const createSettingsModal = (closeModalButtonText, settingsObj) => {
  const settingsModal = document.createElement("dialog");
  settingsModal.classList.add("settings-modal");
  settingsModal.setAttribute("id", "settings-modal");
  const closeModalButton = document.createElement("button");
  closeModalButton.innerText = closeModalButtonText;
  closeModalButton.setAttribute("autofocus", true);
  closeModalButton.addEventListener("click", () => {
    settingsModal.close();
  });

  // add callbacks to buttons' event listeners that are settingsObj instance methods
  // i.e. a controlSoundFxButton would use settingsObj.toggleSoundFxOnOff(), a selectMusicButton would use settingsObj.selectMusic(), a setColorPaletteButton would use settingsObj.setColorPalette(), etc.
  // then, all of those buttons would be appended to the settingsModal

  settingsModal.appendChild(closeModalButton);

  return settingsModal;
};

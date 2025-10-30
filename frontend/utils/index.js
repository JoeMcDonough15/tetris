// render two navigation links wrapped inside buttons in a nav container

export const createNavButtons = (firstButton, secondButton) => {
  const navButtonsContainer = document.createElement("nav");
  const mainMenuButton = document.createElement("button");
  const highScoresButton = document.createElement("button");
  const mainMenuLink = document.createElement("a");
  const highScoresLink = document.createElement("a");
  mainMenuLink.setAttribute("href", firstButton.buttonDestination);
  mainMenuLink.innerText = firstButton.buttonText;
  highScoresLink.setAttribute("href", secondButton.buttonDestination);
  highScoresLink.innerText = secondButton.buttonText;
  navButtonsContainer.classList.add("nav-buttons");
  mainMenuButton.classList.add("nav-button");
  mainMenuLink.classList.add("nav-link");
  highScoresButton.classList.add("nav-button");
  highScoresLink.classList.add("nav-link");

  // append links to buttons and buttons to nav
  mainMenuButton.appendChild(mainMenuLink);
  highScoresButton.appendChild(highScoresLink);
  navButtonsContainer.append(mainMenuButton, highScoresButton);

  return navButtonsContainer;
};

// render a player name form with a custom method to be called on submit

export const createPlayerNameForm = (methodForSubmit) => {
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

  const playerNameLabel = document.createElement("label");
  playerNameLabel.innerText = "Enter your name: ";
  playerNameLabel.setAttribute("for", "player-name");

  const playerNameInput = document.createElement("input");
  playerNameInput.setAttribute("id", "player-name");
  playerNameInput.setAttribute("type", "text");
  playerNameInput.setAttribute("name", "player-name");
  playerNameInput.setAttribute("required", true);

  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.innerText = "Submit";

  playerNameForm.append(playerNameLabel, playerNameInput, submitButton);

  return playerNameForm;
};

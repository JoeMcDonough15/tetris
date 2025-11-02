// Utility Functions
export const returnBody = () => {
  const bodyArrayFromCollection = Array.from(
    document.getElementsByTagName("body")
  );
  const body = bodyArrayFromCollection[0];
  return body;
};

// Menu Buttons
export const mainMenuButtonsContainerObj = {
  elementName: "div",
  classes: ["menu-buttons"],
};

export const mainMenuButtonObjs = [
  { buttonText: "Start Game", navLink: "/play-game" },
  {
    buttonText: "View High Scores",
    navLink: "/high-scores",
  },
  {
    buttonText: "Settings",
    id: "open-modal-button",
  },
];

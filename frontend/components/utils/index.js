import { updateSettingsFormData } from "../../utils/index.js";

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

// render a form to put inside the settingsModal in order to update settings
export const createUpdateSettingsForm = () => {
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

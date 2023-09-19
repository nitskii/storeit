const newLocationModal = document.getElementById('new-location-modal');
const parentSelectModal = document.getElementById('parent-select-modal');
const locationResultModal = document.getElementById('location-result-modal');

document
  .getElementById('button-hide-new-location-modal')
  .addEventListener('click', () => hideElement(newLocationModal));
document
  .getElementById('button-hide-location-result-modal')
  .addEventListener('click', () => hideElement(locationResultModal));
document
  .getElementById('button-new-location-to-action-select')
  .addEventListener('click', () => replaceElement(newLocationModal, actionSelectModal));
document
  .getElementById('button-new-location-to-parent-select')
  .addEventListener('click', () => replaceElement(newLocationModal, parentSelectModal));
document
  .getElementById('button-parent-select-to-new-location')
  .addEventListener('click', () => replaceElement(parentSelectModal, newLocationModal));
document
  .getElementById('button-location-result-to-new-location')
  .addEventListener('click', () => replaceElement(locationResultModal, newLocationModal));

const parentSelectionBlock = document.getElementById('parent-selection-block');

document
  .getElementById('parent-selection-block-toggler')
  .addEventListener('change', (e) => (parentSelectionBlock.hidden = !e.target.checked));

const buttonSelectParent = document.getElementById('button-select-parent');
const parentIdInput = document.getElementById('parent-id-input');

const changeSelectedLocation = (selectedItem) => {
  buttonSelectParent.innerText = `Обрати локацію ${selectedItem.innerText}`;
  buttonSelectParent.hidden = false;
  parentIdInput.value = selectedItem.dataset.id;
};

buttonSelectParent.addEventListener(
  'click',
  () => {
    parentIdInput.disabled = false;
    replaceElement(parentSelectModal, newLocationModal);
  }
);

const locationNameInput = document.getElementById('location-name-input');
const locationExistsMessage = document.getElementById('location-exists-message');

const handlePostLocationResult = ({ target: { form }, xhr: { status } }) => {
  if (status == 409) {
    locationExistsMessage.hidden = false;
    locationNameInput.addEventListener(
      'input',
      () => (locationExistsMessage.hidden = true),
      { once: true }
    );

    return;
  }

  replaceElement(newLocationModal, locationResultModal);
  form.reset();
  parentSelectionBlock.hidden = true;
};
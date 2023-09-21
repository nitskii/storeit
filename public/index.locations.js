const newLocationModal = document.getElementById('new-location-modal');
const parentSelectModal = document.getElementById('parent-select-modal');
const locationResultModal = document.getElementById('location-result-modal');

document
  .getElementById('button-hide-new-location-modal')
  .addEventListener('click', () => hideModal(newLocationModal));
document
  .getElementById('button-hide-location-result-modal')
  .addEventListener('click', () => hideModal(locationResultModal));
document
  .getElementById('button-new-location-to-action-select')
  .addEventListener('click', () => replaceModal(newLocationModal, actionSelectModal));
document
  .getElementById('button-new-location-to-parent-select')
  .addEventListener('click', () => replaceModal(newLocationModal, parentSelectModal));
document
  .getElementById('button-location-result-to-new-location')
  .addEventListener('click', () => replaceModal(locationResultModal, newLocationModal));

const parentSelectionBlock = document.getElementById('parent-selection-block');

document
  .getElementById('parent-selection-block-toggler')
  .addEventListener('change', (e) => (parentSelectionBlock.hidden = !e.target.checked));

document
  .getElementById('button-parent-select-back')
  .addEventListener('click', () => replaceModal(parentSelectModal, newLocationModal));

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
    replaceModal(parentSelectModal, newLocationModal);
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

  replaceModal(newLocationModal, locationResultModal);
  form.reset();
  parentSelectionBlock.hidden = true;
};
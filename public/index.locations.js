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
  .addEventListener(
    'change',
    (e) => {
      parentSelectionBlock.hidden = !e.target.checked

      if (e.target.checked && parentIdInput.value) {
        parentIdInput.disabled = false;
      } else {
        parentIdInput.disabled = true;
      }
    }
  );

const INITIAL_PATH = '/api/root-locations';
let currentPath = INITIAL_PATH;
const pathHistory = [];
const currentLocationChainMessage = document.getElementById('current-location-chain-message');

const handleLoadButtonClick = (path, name) => {
  pathHistory.push(currentPath);
  currentPath = path;

  currentLocationChainMessage.innerText = currentLocationChainMessage.innerText.trim();

  if (currentLocationChainMessage.innerText) {
    currentLocationChainMessage.innerText += ` > ${name}`;
  } else {
    currentLocationChainMessage.innerText = name;
    currentLocationChainMessage.hidden = false;
  }
}

document
  .getElementById('button-parent-select-back')
  .addEventListener(
    'click',
    async () => {
      if(pathHistory.length) {
        await htmx.ajax('GET', pathHistory.pop(), '#locations-list');

        if (pathHistory.length == 0) {
          currentPath = INITIAL_PATH;
          currentLocationChainMessage.innerText = "";
        } else {
          currentLocationChainMessage.innerText = currentLocationChainMessage.innerText.slice(0, currentLocationChainMessage.innerText.lastIndexOf('>'))
        }

        return;
      }

      replaceModal(parentSelectModal, newLocationModal);
    }
  );

const buttonSelectParent = document.getElementById('button-select-parent');
const selectedParentMessage = document.getElementById('selected-parent-message');
const parentIdInput = document.getElementById('parent-id-input');

const changeSelectedLocation = (selectedItem) => {
  buttonSelectParent.innerText = `Обрати локацію ${selectedItem.innerText}`;
  buttonSelectParent.hidden = false;
  buttonSelectParent.dataset['name'] = selectedItem.innerText;
  parentIdInput.value = selectedItem.dataset.id;
};

buttonSelectParent.addEventListener(
  'click',
  () => {
    selectedParentMessage.innerText = `Обрано локацію ${currentLocationChainMessage.innerText ? `${currentLocationChainMessage.innerText} >` : ""} ${buttonSelectParent.dataset.name}`;
    currentLocationChainMessage.innerText = "";
    selectedParentMessage.hidden = false;
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
  parentIdInput.value = "";
  parentIdInput.disabled = true;
  currentLocationChainMessage.innerText = "";
  selectedParentMessage.innerText = "";
  currentPath = INITIAL_PATH;
  buttonSelectParent.hidden = true;
  parentSelectionBlock.hidden = true;
};
/* eslint-disable */

const   actionSelectModal = document.getElementById(  'action-select-modal');
const        newItemModal = document.getElementById(       'new-item-modal');
const    newLocationModal = document.getElementById(   'new-location-modal');
const   parentSelectModal = document.getElementById(  'parent-select-modal');
const locationResultModal = document.getElementById('location-result-modal');

const       buttonShowActionSelectModal = document.getElementById(       'button-show-action-select-modal');
const       buttonHideActionSelectModal = document.getElementById(       'button-hide-action-select-modal');
const            buttonHideNewItemModal = document.getElementById(            'button-hide-new-item-modal');
const        buttonHideNewLocationModal = document.getElementById(        'button-hide-new-location-modal');
const     buttonHideLocationResultModal = document.getElementById(     'button-hide-location-result-modal');
const       buttonActionSelectToNewItem = document.getElementById(      'button-action-select-to-new-item');
const   buttonActionSelectToNewLocation = document.getElementById(  'button-action-select-to-new-location');
const       buttonNewItemToActionSelect = document.getElementById(      'button-new-item-to-action-select');
const   buttonNewLocationToActionSelect = document.getElementById(  'button-new-location-to-action-select');
const   buttonNewLocationToParentSelect = document.getElementById(  'button-new-location-to-parent-select');
const   buttonParentSelectToNewLocation = document.getElementById(  'button-parent-select-to-new-location');
const buttonLocationResultToNewLocation = document.getElementById('button-location-result-to-new-location');

const    showElement =                (element) => {     element.classList.replace('hidden', 'flex') }
const    hideElement =                (element) => {     element.classList.replace('flex', 'hidden') }
const replaceElement = (oldElement, newElement) => { hideElement(oldElement);showElement(newElement) }

      buttonShowActionSelectModal.addEventListener('click', () =>    showElement(                     actionSelectModal));
      buttonHideActionSelectModal.addEventListener('click', () =>    hideElement(                     actionSelectModal));
           buttonHideNewItemModal.addEventListener('click', () =>    hideElement(                          newItemModal));
       buttonHideNewLocationModal.addEventListener('click', () =>    hideElement(                      newLocationModal));
    buttonHideLocationResultModal.addEventListener('click', () =>    hideElement(                   locationResultModal));
      buttonActionSelectToNewItem.addEventListener('click', () => replaceElement(  actionSelectModal,      newItemModal));
  buttonActionSelectToNewLocation.addEventListener('click', () => replaceElement(  actionSelectModal,  newLocationModal));
      buttonNewItemToActionSelect.addEventListener('click', () => replaceElement(       newItemModal, actionSelectModal));
  buttonNewLocationToActionSelect.addEventListener('click', () => replaceElement(   newLocationModal, actionSelectModal));
  buttonNewLocationToParentSelect.addEventListener('click', () => replaceElement(   newLocationModal, parentSelectModal));
  buttonParentSelectToNewLocation.addEventListener('click', () => replaceElement(  parentSelectModal,  newLocationModal));
buttonLocationResultToNewLocation.addEventListener('click', () => replaceElement(locationResultModal,  newLocationModal));

const           locationNameInput = document.getElementById(           'location-name-input');
const       locationExistsMessage = document.getElementById(       'location-exists-message');
const parentSelectionBlockToggler = document.getElementById('parent-selection-block-toggler');
const        parentSelectionBlock = document.getElementById(        'parent-selection-block');

parentSelectionBlockToggler.addEventListener(
  'change',
  (e) => {
    parentSelectionBlock.hidden = !e.target.checked
    parentSelectionBlock.children.namedItem('parentId').disabled = !e.target.checked;
  }
);

const    buttonSelectParent = document.getElementById(   'button-select-parent');
const selectedParentMessage = document.getElementById('selected-parent-message');
const         parentIdInput = document.getElementById(        'parent-id-input');

buttonSelectParent.addEventListener(
  'click',
  (e) => {
    selectedParentMessage.innerText = `Обрано локацію ${e.target.dataset.value}`;
    selectedParentMessage.hidden = false;
    parentIdInput.value = e.target.dataset.id;
    parentIdInput.disabled = false;
    replaceElement(parentSelectModal, newLocationModal);
  }
);

const changeSelectedLocation = (selectedItem) => {
  selectedItem.classList.add('bg-orange-300');
  [...selectedItem.parentElement.children]
    .filter((c) => c.innerText != selectedItem.innerText)
    .forEach((c) => c.classList.remove('bg-orange-300'));
  buttonSelectParent.innerText = `Обрати локацію ${selectedItem.innerText}`;
  buttonSelectParent.dataset['id'] = selectedItem.dataset.id;
  buttonSelectParent.dataset['value'] = selectedItem.innerText;
  buttonSelectParent.hidden = false;
};

const handlePostLocationResult = ({ target: { form }, xhr: { status } }) => {
  if (status != 204) {
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
  selectedParentMessage.hidden = true;
};
const showElement = (element) => { element.classList.replace('hidden', 'flex') };
const hideElement = (element) => { element.classList.replace('flex', 'hidden') };
const replaceElement = (oldElement, newElement) => { hideElement(oldElement);showElement(newElement) };

const actionSelectModal = document.getElementById('action-select-modal');

document
  .getElementById('button-show-action-select-modal')
  .addEventListener('click', () => showElement(actionSelectModal));
document
  .getElementById('button-hide-action-select-modal')
  .addEventListener('click', () => hideElement(actionSelectModal));
document
  .getElementById('button-action-select-to-new-item')
  .addEventListener('click', () => replaceElement(actionSelectModal, newItemModal));
document
  .getElementById('button-action-select-to-new-location')
  .addEventListener('click', () => replaceElement(actionSelectModal, newLocationModal));

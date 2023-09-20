const showModal = (element) => { element.classList.replace('hidden', 'flex') };
const hideModal = (element) => { element.classList.replace('flex', 'hidden') };
const replaceModal = (oldElement, newElement) => { hideModal(oldElement);showModal(newElement) };

const actionSelectModal = document.getElementById('action-select-modal');

document
  .getElementById('button-show-action-select-modal')
  .addEventListener('click', () => showModal(actionSelectModal));
document
  .getElementById('button-hide-action-select-modal')
  .addEventListener('click', () => hideModal(actionSelectModal));
document
  .getElementById('button-action-select-to-new-item')
  .addEventListener('click', () => replaceModal(actionSelectModal, newItemModal));
document
  .getElementById('button-action-select-to-new-location')
  .addEventListener('click', () => replaceModal(actionSelectModal, newLocationModal));

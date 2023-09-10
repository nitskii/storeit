/* eslint-disable no-unused-vars */

const actionSelectModal = document.getElementById('action-select-modal');

const showActionSelectModal = () => {
  actionSelectModal.classList.replace('hidden', 'flex');
};

const hideActionSelectModal = () => {
  actionSelectModal.classList.replace('flex', 'hidden');
};

const newItemModal = document.getElementById('new-item-modal');

const showNewItemModal = () => {
  newItemModal.classList.replace('hidden', 'flex');
};

const hideNewItemModal = () => {
  newItemModal.classList.replace('flex', 'hidden');
};

const newLocationModal = document.getElementById('new-location-modal');

const showNewLocationModal = () => {
  newLocationModal.classList.replace('hidden', 'flex');
};

const hideNewLocationModal = () => {
  newLocationModal.classList.replace('flex', 'hidden');
};

const parentLocationSelectModal = document.getElementById(
  'parent-location-select-modal'
);

const showParentLocationSelectModal = () => {
  parentLocationSelectModal.classList.replace('hidden', 'flex');
};

const hideParentLocationSelectModal = () => {
  parentLocationSelectModal.classList.replace('flex', 'hidden');
};

const tagInput = document.getElementById('tag-input');
const tagsList = document.getElementById('selected-tags-list');
const tagExistsMessage = document.getElementById('tag-exists-message');

const addTagToList = () => {
  if (!tagInput.value) return;

  const items = tagsList.getElementsByTagName('li');

  for (let item of items) {
    if (item.innerText === tagInput.value) {
      tagExistsMessage.hidden = false;
      tagInput.addEventListener(
        'input',
        () => (tagExistsMessage.hidden = true),
        { once: true }
      );
      return;
    }
  }

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('cursor-pointer', 'p-2');
  removeButton.innerHTML = `
    <svg
      style="pointer-events: none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="h-4 w-4">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  `;
  removeButton.addEventListener(
    'click',
    (e) => {
      e.target.parentElement.remove();
      tagsList.children.length || tagsList.classList.replace('flex', 'hidden');
    },
    { once: true }
  );

  const tagHiddenInput = document.createElement('input');
  tagHiddenInput.type = 'hidden';
  tagHiddenInput.value = tagInput.value;
  tagHiddenInput.name = 'tags';

  const listItem = document.createElement('li');
  listItem.classList.add(
    'flex',
    'items-center',
    'rounded-lg',
    'bg-orange-200',
    'pl-2'
  );
  listItem.append(tagHiddenInput);
  listItem.append(tagInput.value);
  listItem.append(removeButton);

  tagsList.append(listItem);
  tagsList.classList.replace('hidden', 'flex');
  tagInput.value = '';
};

const parentLocationSelectButton = document.getElementById(
  'parent-location-select-button'
);

const toggleParentLocationSelectButton = () => {
  parentLocationSelectButton.hidden = !parentLocationSelectButton.hidden;
};

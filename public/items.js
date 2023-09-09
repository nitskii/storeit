/* eslint-disable no-unused-vars */

const selectModal = document.getElementById('select-modal');

const showSelectModal = () => {
  selectModal.classList.replace('hidden', 'flex');
};

const hideSelectModal = () => {
  selectModal.classList.replace('flex', 'hidden');
};

const itemModal = document.getElementById('item-modal');

const showItemModal = () => {
  itemModal.classList.replace('hidden', 'flex');
};

const hideItemModal = () => {
  itemModal.classList.replace('flex', 'hidden');
};

const locationModal = document.getElementById('location-modal');

const showLocationModal = () => {
  locationModal.classList.replace('hidden', 'flex');
};

const hideLocationModal = () => {
  locationModal.classList.replace('flex', 'hidden');
};

const addTagToList = () => {
  const tagInput = document.getElementById('tag-input');

  if (!tagInput.value) return;

  const tagsList = document.getElementById('selected-tags-list');

  const items = tagsList.getElementsByTagName('li');

  for (let item of items) {
    if (item.innerText === tagInput.value) {
      return;
    }
  }

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('cursor-pointer', 'p-2');
  removeButton.innerHTML =
    '<svg style="pointer-events:none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>';
  removeButton.addEventListener('click', (e) => {
    e.target.parentElement.remove();
    tagsList.children.length || tagsList.classList.replace('flex', 'hidden');
  });

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

const parentSelect = document.getElementById('parent-select');

const toggleParentSelect = () => {
  parentSelect.hidden = parentSelect.disabled = !parentSelect.disabled;
};

/* eslint-disable */

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

const selectParentLocationButton = document.getElementById(
  'select-parent-location-button'
);

const changeSelectedLocation = (selectedItem) => {
  selectedItem.classList.add('bg-orange-300');
  [...selectedItem.parentElement.children]
    .filter((c) => c.innerText != selectedItem.innerText)
    .forEach((c) => c.classList.remove('bg-orange-300'));
  selectParentLocationButton.innerText = `Обрати локацію ${selectedItem.innerText}`;
  selectParentLocationButton.dataset['id'] = selectedItem.dataset.id;
  selectParentLocationButton.dataset['value'] = selectedItem.innerText;
  selectParentLocationButton.hidden = false;
};

const selectedParentLocationMessage = document.getElementById(
  'selected-parent-location-message'
);

const parentIdInput = document.getElementById('parent-id-input');

const selectParentLocation = (target) => {
  selectedParentLocationMessage.innerText = `Обрано локацію ${target.dataset.value}`;
  selectedParentLocationMessage.hidden = false;
  parentIdInput.value = target.dataset.id;
  parentIdInput.disabled = false;
  hideParentLocationSelectModal();
  showNewLocationModal();
};

const parentLocationSelectBlock = document.getElementById(
  'parent-location-select-block'
);

const parentLocationSelectButton = document.getElementById(
  'parent-location-select-button'
);

const locationNameInput = document.getElementById('location-name-input');
const locationExistsMessage = document.getElementById(
  'location-exists-message'
);

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

  hideNewLocationModal();
  form.reset();
  parentLocationSelectBlock.hidden = true;
  selectedParentLocationMessage.hidden = true;
  showLocationResultModal();
};

const locationResultModal = document.getElementById('location-result-modal');

const showLocationResultModal = () => {
  locationResultModal.classList.replace('hidden', 'flex');
};

const hideLocationResultModal = () => {
  locationResultModal.classList.replace('flex', 'hidden');
};

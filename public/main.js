let itemModal = null;
let tagInput = null;
let addedTagsList = null;
let tagInputBlock = null;
let locationModal = null;
let locationSelectionBlock = null;
let locationIdInput = null;
let locationSelectionModal = null;
let buttonSelectLocation = null;
let currentLocationChainMessage = null;
let selectedLocationMessage = null;
let locationResultModal = null;
let menu = null;

htmx.onLoad(() => {
  itemModal = htmx.find('#item-modal');
  tagInput = htmx.find('#tag-input');
  addedTagsList = htmx.find('#added-tags-list');
  tagInputBlock = htmx.find('#tag-input-block');
  locationModal = htmx.find('#location-modal');
  locationSelectionBlock = htmx.find('#location-selection-block');
  locationIdInput = htmx.find('#location-id-input');
  locationSelectionModal = htmx.find('#location-selection-modal');
  buttonSelectLocation = htmx.find('#button-select-location');
  currentLocationChainMessage = htmx.find('#current-location-chain-message');
  selectedLocationMessage = htmx.find('#selected-location-message');
  locationResultModal = htmx.find('#location-result-modal');
  menu = htmx.find('#menu');
});

const handleRequestResult = (detail) => {
  const targetId = detail.xhr.getResponseHeader('HX-Retarget');

  if (!targetId) {
    return;
  }

  const inputBlock = htmx.find(targetId);

  if (inputBlock.childElementCount == 1) {
    detail.shouldSwap = true;

    inputBlock.firstChild.addEventListener(
      'input',
      () => htmx.remove(inputBlock.lastChild),
      { once: true }
    );
  }
};

htmx.replaceClass = (elt, oldClass, newClass) => {
  htmx.addClass(elt, newClass);
  htmx.removeClass(elt, oldClass);
};

const showItemModal = () => {
  htmx.replaceClass(itemModal, 'hidden', 'flex');
  htmx.removeClass(menu, 'w-full');
  htmx.removeClass(menu, 'h-screen');
  htmx.addClass(menu, 'hidden');
};

const hideItemModal = () => {
  htmx.replaceClass(itemModal, 'flex', 'hidden');
};

const tagExistsMessage = document.createElement('div');
tagExistsMessage.innerText = 'Тег вже додано';
htmx.addClass(tagExistsMessage, 'pl-2');
htmx.addClass(tagExistsMessage, 'pt-1');
htmx.addClass(tagExistsMessage, 'text-red-500');

const addTagToList = () => {
  if (tagInput.value == '') {
    return;
  }

  const addedTags = addedTagsList.children;

  for (let addedTag of addedTags) {
    if (addedTag.innerText == tagInput.value) {
      tagInputBlock.append(tagExistsMessage);

      tagInput.addEventListener('input', () => htmx.remove(tagExistsMessage), {
        once: true
      });

      return;
    }
  }

  const newTag = document.createElement('li');

  const crossImage = document.createElement('img');
  crossImage.src = '/public/cross.svg';
  htmx.addClass(crossImage, 'w-6');
  htmx.addClass(crossImage, 'h-6');

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  htmx.addClass(removeButton, 'p-1');
  removeButton.append(crossImage);
  removeButton.addEventListener(
    'click',
    () => {
      htmx.remove(newTag);
      addedTagsList.childElementCount ||
        htmx.replaceClass(addedTagsList, 'flex', 'hidden');
    },
    {
      once: true
    }
  );

  const tagHiddenInput = document.createElement('input');
  tagHiddenInput.type = 'hidden';
  tagHiddenInput.value = tagInput.value;
  tagHiddenInput.name = 'tags';

  htmx.addClass(newTag, 'flex');
  htmx.addClass(newTag, 'items-center');
  htmx.addClass(newTag, 'rounded-lg');
  htmx.addClass(newTag, 'bg-orange-200');
  htmx.addClass(newTag, 'pl-2');
  newTag.append(tagHiddenInput);
  newTag.append(tagInput.value);
  newTag.append(removeButton);

  addedTagsList.append(newTag);
  htmx.replaceClass(addedTagsList, 'hidden', 'flex');
  tagInput.value = '';
};

const showLocationModal = () => {
  htmx.replaceClass(locationModal, 'hidden', 'flex');
};

const hideLocationModal = () => {
  htmx.replaceClass(locationModal, 'flex', 'hidden');
};

const toggleLocationSelectionBlock = (checked) => {
  locationSelectionBlock.hidden = !checked;

  locationIdInput.disabled = !(checked && locationIdInput.value);
};

const showLocationSelectionModal = () => {
  htmx.replaceClass(locationSelectionModal, 'hidden', 'flex');
};

const hideLocationSelectionModal = () => {
  htmx.replaceClass(locationSelectionModal, 'flex', 'hidden');
};

const updateButtonSelectLocationState = ({ id, name }) => {
  buttonSelectLocation.innerText = `Обрати локацію ${name}`;
  buttonSelectLocation.hidden = false;
  buttonSelectLocation.dataset['id'] = id;
  buttonSelectLocation.dataset['name'] = name;
};

const INITIAL_PATH = '/api/root-locations';
let currentPath = INITIAL_PATH;
const pathHistory = [];
let currentLocationChain = '';

const handleLoadButtonClick = ({ path, name }) => {
  pathHistory.push(currentPath);
  currentPath = path;

  if (currentLocationChain) {
    currentLocationChain += ` > ${name}`;
  } else {
    currentLocationChain = name;
    currentLocationChainMessage.hidden = false;
  }

  currentLocationChainMessage.innerText = currentLocationChain;
};

const handleBackButtonClick = async () => {
  if (pathHistory.length) {
    await htmx.ajax('GET', pathHistory.pop(), '#locations-list');

    if (pathHistory.length) {
      const lastLocationIndex = currentLocationChain.lastIndexOf('>');
      currentLocationChain = currentLocationChain.slice(0, lastLocationIndex);
      currentLocationChainMessage.innerText = currentLocationChain;
    } else {
      currentPath = INITIAL_PATH;
      currentLocationChain = '';
      currentLocationChainMessage.innerText = currentLocationChain;
    }

    return;
  }

  hideLocationSelectionModal();
};

const handleSelectLocationButtonClick = () => {
  const finalLocation = buttonSelectLocation.dataset.name;

  if (currentLocationChain) {
    selectedLocationMessage.innerText = `${currentLocationChain} > ${finalLocation}`;
  } else {
    selectedLocationMessage.innerText = finalLocation;
  }

  currentLocationChain = '';
  currentLocationChainMessage.innerText = currentLocationChain;
  selectedLocationMessage.hidden = false;
  locationIdInput.value = buttonSelectLocation.dataset.id;
  locationIdInput.disabled = false;

  hideLocationSelectionModal();
};

const showLocationResultModal = () => {
  htmx.replaceClass(locationResultModal, 'hidden', 'flex');
};

const hideLocationResultModal = () => {
  htmx.replaceClass(locationResultModal, 'flex', 'hidden');
};

const handlePostLocationResult = (detail) => {
  handleRequestResult(detail);

  hideLocationModal();
  showLocationResultModal();
  detail.target.form.reset();
  currentLocationChain = '';
  currentLocationChainMessage.innerText = currentLocationChain;
  locationIdInput.value = '';
  locationIdInput.disabled = true;
  selectedLocationMessage.innerText = '';
  currentPath = INITIAL_PATH;
  buttonSelectLocation.hidden = true;
  locationSelectionBlock.hidden = true;
};

const toggleMenu = () => {
  menu.classList.toggle('hidden');
  menu.classList.toggle('w-full');
  menu.classList.toggle('h-screen');
};

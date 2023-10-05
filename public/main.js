let itemModal = null;
let tagInput = null;
let addedTagsList = null;
let tagInputBlock = null;
let locationModal = null;
let parentSelectionBlock = null;
let parentIdInput = null;
let parentSelectionModal = null;
let buttonSelectParent = null;
let currentLocationChainMessage = null;
let selectedParentMessage = null;
let locationResultModal = null;

htmx.onLoad(() => {
  itemModal = htmx.find('#item-modal');
  tagInput = htmx.find('#tag-input');
  addedTagsList = htmx.find('#added-tags-list');
  tagInputBlock = htmx.find('#tag-input-block');
  locationModal = htmx.find('#location-modal');
  parentSelectionBlock = htmx.find('#parent-selection-block');
  parentIdInput = htmx.find('#parent-id-input');
  parentSelectionModal = htmx.find('#parent-selection-modal');
  buttonSelectParent = htmx.find('#button-select-parent');
  currentLocationChainMessage = htmx.find('#current-location-chain-message');
  selectedParentMessage = htmx.find('#selected-parent-message');
  locationResultModal = htmx.find('#location-result-modal');
})

const handleRequestResult = (detail) => {
  const targetId = detail.xhr.getResponseHeader('HX-Retarget');

  if (!targetId) {
    return;
  }

  const inputBlock = htmx.find(targetId);

  if (inputBlock.childElementCount == 1) {
    detail.shouldSwap = true;

    inputBlock
      .firstChild
      .addEventListener(
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
        
      tagInput.addEventListener(
        'input',
        () => htmx.remove(tagExistsMessage),
        { once: true }
      );

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
    }, {
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

const toggleParentSelectionBlock = (checked) => {
  parentSelectionBlock.hidden = !checked;

  parentIdInput.disabled = !(checked && parentIdInput.value);
};

const showParentSelectionModal = () => {
  htmx.replaceClass(parentSelectionModal, 'hidden', 'flex');
};

const hideParentSelectionModal = () => {
  htmx.replaceClass(parentSelectionModal, 'flex', 'hidden');
};

const updateButtonSelectParentState = ({ id, name }) => {
  buttonSelectParent.innerText = `Обрати локацію ${name}`;
  buttonSelectParent.hidden = false;
  buttonSelectParent.dataset['id'] = id;
  buttonSelectParent.dataset['name'] = name;
};

const INITIAL_PATH = '/api/root-locations';
let currentPath = INITIAL_PATH;
const pathHistory = [];
let currentLocationChain = "";

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
      currentLocationChain = "";
      currentLocationChainMessage.innerText = currentLocationChain;
    }

    return;
  }

  hideParentSelectionModal();
  showLocationModal();
}

const handleSelectButtonClick = () => {
  const finalLocation = buttonSelectParent.dataset.name;

  if (currentLocationChain) {
    selectedParentMessage.innerText = `${currentLocationChain} > ${finalLocation}`;
  } else {
    selectedParentMessage.innerText = finalLocation;
  }

  currentLocationChain = "";
  currentLocationChainMessage.innerText = currentLocationChain;
  selectedParentMessage.hidden = false;
  parentIdInput.value = buttonSelectParent.dataset.id;
  parentIdInput.disabled = false;

  hideParentSelectionModal();
  showLocationModal();
}

const showLocationResultModal = () => {
  htmx.replaceClass(locationResultModal, 'hidden', 'flex');
}

const hideLocationResultModal = () => {
  htmx.replaceClass(locationResultModal, 'flex', 'hidden');
}

const handlePostLocationResult = (detail) => {
  handleRequestResult(detail);

  hideLocationModal();
  showLocationResultModal();
  detail.target.form.reset();
  currentLocationChain = "";
  currentLocationChainMessage.innerText = currentLocationChain;
  parentIdInput.value = "";
  parentIdInput.disabled = true;
  selectedParentMessage.innerText = "";
  currentPath = INITIAL_PATH;
  buttonSelectParent.hidden = true;
  parentSelectionBlock.hidden = true;
}
htmx.replaceClass = (elt, oldClass, newClass) => {
  htmx.addClass(elt, newClass);
  htmx.removeClass(elt, oldClass);
};

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

const showItemModal = () => {
  htmx.replaceClass(htmx.find('#item-modal'), 'hidden', 'flex');
};

const hideItemModal = () => {
  htmx.replaceClass(htmx.find('#item-modal'), 'flex', 'hidden');
};

const tagExistsMessage = document.createElement('div');
tagExistsMessage.innerText = 'Тег вже додано';
htmx.addClass(tagExistsMessage, 'pl-2');
htmx.addClass(tagExistsMessage, 'pt-1');
htmx.addClass(tagExistsMessage, 'text-red-500');

const addTagToList = () => {
  const tagInput = htmx.find('#tag-input');

  if (tagInput.value == '') {
    return;
  }

  const addedTagsList = htmx.find('#added-tags-list');
  const addedTags = addedTagsList.children;

  for (let addedTag of addedTags) {
    if (addedTag.innerText == tagInput.value) {
      htmx
        .find('#tag-input-block')
        .append(tagExistsMessage);
        
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
  htmx.replaceClass(htmx.find('#location-modal'), 'hidden', 'flex');
};

const hideLocationModal = () => {
  htmx.replaceClass(htmx.find('#location-modal'), 'flex', 'hidden');
};

const toggleParentSelectionBlock = (checked) => {
  htmx
    .find('#parent-selection-block')
    .hidden = !checked;

  const parentIdInput = htmx.find('#parent-id-input');

  parentIdInput.disabled = !(checked && parentIdInput.value);
}

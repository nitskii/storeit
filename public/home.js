htmx.onLoad(() => {
  globalThis.itemModal = htmx.find('#item-modal');

  globalThis.showItemModal = () => {
    htmx.trigger('#tags-datalist', 'dataLoad');
    htmx.replaceClass(itemModal, 'hidden', 'flex');
    htmx.removeClass(menu, 'w-full');
    htmx.removeClass(menu, 'h-screen');
    htmx.addClass(menu, 'hidden');
  };

  globalThis.hideItemModal = () => {
    htmx.replaceClass(itemModal, 'flex', 'hidden');
  };

  globalThis.tagExistsMessage = document.createElement('div');
  tagExistsMessage.innerText = 'Тег вже додано';
  htmx.addClass(tagExistsMessage, 'pl-2');
  htmx.addClass(tagExistsMessage, 'pt-1');
  htmx.addClass(tagExistsMessage, 'text-red-500');

  globalThis.tagInput = htmx.find('#tag-input');
  globalThis.addedTagsList = htmx.find('#added-tags-list');

  globalThis.addTagToList = () => {
    if (tagInput.value === '') return;

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
      },
      { once: true }
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

  globalThis.handlePostItemResult = (event) => {
    handleResponse(event);

    const { status } = event.detail.xhr;

    if (status < 400 || status >= 500) {
      hideItemModal();
      showItemResultModal();
      event.detail.target.form.reset();
      addedTagsList.innerHTML = '';
      currentLocationChain = '';
      currentLocationChainMessage.innerText =
      currentLocationChain;
      locationIdInput.value = '';
      selectedLocationMessage.innerText = '';
      currentPath = INITIAL_PATH;
      buttonSelectLocation.hidden = true;
    }
  };

  globalThis.itemResultModal = htmx.find('#item-result-modal');

  globalThis.showItemResultModal = () => {
    htmx.replaceClass(itemResultModal, 'hidden', 'flex');
  };

  globalThis.hideItemResultModal = () => {
    htmx.replaceClass(itemResultModal, 'flex', 'hidden');
  };
});

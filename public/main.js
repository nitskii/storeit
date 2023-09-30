const handleSignupResult = (detail) => {
  if (result.status >= 400) {
    const { xhr: result, elt: signupButton } = detail;

    const errorMessage = new DOMParser()
    .parseFromString(result.response, 'text/html')
    .body
    .firstChild;

    const field = result.getResponseHeader('X-Field');

    htmx
      .find(`#${field}-input-block`)
      .append(errorMessage);

    htmx
      .find(`#${field}-input`)
      .addEventListener(
        'input',
        () => (htmx.remove(errorMessage)),
        { once: true }
      );

    signupButton
      .addEventListener(
        'click',
        () => (htmx.remove(errorMessage)),
        { once: true }
      );
  }
};

const handleLoginResult = (detail) => {
  if (result.status >= 400) {
    const { xhr: result, elt: loginButton } = detail;
    
    const errorMessage = new DOMParser()
    .parseFromString(result.response, 'text/html')
    .body
    .firstChild;

    const field = result.getResponseHeader('X-Field');

    htmx
      .find(`#${field}-input-block`)
      .append(errorMessage);

    htmx
      .find(`#${field}-input`)
      .addEventListener(
        'input',
        () => (htmx.remove(errorMessage)),
        { once: true }
      );

    loginButton
      .addEventListener(
        'click',
        () => (htmx.remove(errorMessage)),
        { once: true }
      );
  }
};

htmx.replaceClass = (elt, oldClass, newClass) => {
  htmx.addClass(elt, newClass);
  htmx.removeClass(elt, oldClass);
}

const showItemModal = () => {
  htmx.replaceClass(htmx.find('#item-modal'), "hidden", "flex");
}

const hideItemModal = () => {
  htmx.replaceClass(htmx.find('#item-modal'), "flex", "hidden");
}

const tagExistsMessage = document.createElement('div');
tagExistsMessage.innerText = 'Тег вже додано';
htmx.addClass(tagExistsMessage, 'pl-2');
htmx.addClass(tagExistsMessage, 'pt-1');
htmx.addClass(tagExistsMessage, 'text-red-500');

const addTagToList = () => {
  const tagInput = htmx.find('#tag-input');

  if (tagInput.value == "") {
    return;
  }

  const addedTagsList = htmx.find('#added-tags-list');
  const addedTags = addedTagsList.children;

  for (let addedTag of addedTags) {
    if (addedTag.innerText == tagInput.value) {
      htmx
        .find('#tag-input-block')
        .append(tagExistsMessage);
      tagInput
        .addEventListener(
          'input',
          () => (htmx.remove(tagExistsMessage)),
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
      addedTagsList.childElementCount || htmx.replaceClass(addedTagsList, 'flex', 'hidden');
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
}

htmx.onLoad(() => {
  globalThis.nameUpdateModal = htmx.find('#name-update-modal');

  globalThis.showNameUpdateModal = () => {
    const nameInput = nameUpdateModal
      .firstChild
      .firstChild
      .firstChild
      .firstChild;

    nameInput.value = htmx.find('#item-name').innerText;
    htmx.replaceClass(nameUpdateModal, 'hidden', 'flex');
    nameInput.focus();
  };

  globalThis.hideNameUpdateModal = () => {
    htmx.replaceClass(nameUpdateModal, 'flex', 'hidden');
  };

  globalThis.handleNameUpdateResult = (event) => {
    handleResponse(event);

    if (!event.detail.isError) {
      hideNameUpdateModal();
    }
  };

  globalThis.locationUpdateModal = htmx.find('#location-update-modal');

  globalThis.showLocationUpdateModal = () => {
    selectedLocationMessage.innerText = `Обрано локацію ${
      htmx.find('#item-location').innerText
    }`;
    htmx.replaceClass(locationUpdateModal, 'hidden', 'flex');
  };

  globalThis.hideLocationUpdateModal = () => {
    htmx.replaceClass(locationUpdateModal, 'flex', 'hidden');
  };

  globalThis.handleLocationUpdateResult = (event) => {
    handleResponse(event);

    if (!event.detail.isError) {
      hideLocationUpdateModal();
    }
  };

  globalThis.tagUpdateModal = htmx.find('#tag-update-modal');

  globalThis.showTagUpdateModal = () => {
    htmx.trigger('#tags-datalist', 'dataLoad');
    htmx.replaceClass(tagUpdateModal, 'hidden', 'flex');
    tagUpdateModal
      .firstChild
      .firstChild
      .firstChild
      .firstChild
      .focus();
  };

  globalThis.hideTagUpdateModal = () => {
    htmx.replaceClass(tagUpdateModal, 'flex', 'hidden');
  };

  globalThis.resetForm = (form) => {
    const tagInput = form.firstChild.firstChild;

    while(tagInput.nextSibling) htmx.remove(tagInput.nextSibling);

    form.reset();
  };

  globalThis.handleTagUpdateResult = (event) => {
    handleResponse(event);

    if (event.detail.xhr.status >= 500) {
      hideTagUpdateModal();
    }
  };

  globalThis.handleTagDeleteResult = ({ detail }) => {
    if (detail.isError) {
      const { response } = detail.xhr;
      const start = response.indexOf('>') + 1;
      const end = response.lastIndexOf('<');

      alert(response.slice(start, end));
    }
  };
});
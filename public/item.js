const nameUpdateModal = htmx.find('#name-update-modal');

const showNameUpdateModal = () => {
  const nameInput = nameUpdateModal
    .firstChild
    .firstChild
    .firstChild
    .firstChild;

  nameInput.value = htmx.find('#item-name').innerText;
  htmx.replaceClass(nameUpdateModal, 'hidden', 'flex');
  nameInput.focus();
};

const hideNameUpdateModal = () => {
  htmx.replaceClass(nameUpdateModal, 'flex', 'hidden');
};

const handleNameUpdateResult = (event) => {
  handleResponse(event);

  if (!event.detail.isError) {
    hideNameUpdateModal();
  }
};

const locationUpdateModal = htmx.find('#location-update-modal');

const showLocationUpdateModal = () => {
  selectedLocationMessage.innerText = `Обрано локацію ${
    htmx.find('#item-location').innerText
  }`;
  htmx.replaceClass(locationUpdateModal, 'hidden', 'flex');
};

const hideLocationUpdateModal = () => {
  htmx.replaceClass(locationUpdateModal, 'flex', 'hidden');
};

const handleLocationUpdateResult = (event) => {
  handleResponse(event);

  if (!event.detail.isError) {
    hideLocationUpdateModal();
  }
};

const tagUpdateModal = htmx.find('#tag-update-modal');

const showTagUpdateModal = () => {
  htmx.trigger('#tags-datalist', 'dataLoad');
  htmx.replaceClass(tagUpdateModal, 'hidden', 'flex');
  tagUpdateModal
    .firstChild
    .firstChild
    .firstChild
    .firstChild
    .focus();
};

const hideTagUpdateModal = () => {
  htmx.replaceClass(tagUpdateModal, 'flex', 'hidden');
};

const resetForm = (form) => {
  const tagInput = form.firstChild.firstChild;

  while(tagInput.nextSibling) htmx.remove(tagInput.nextSibling);

  form.reset();
};

const handleTagUpdateResult = (event) => {
  handleResponse(event);

  if (event.detail.xhr.status >= 500) {
    hideTagUpdateModal();
  }
};

const handleTagDeleteResult = ({ detail }) => {
  if (detail.isError) {
    const { response } = detail.xhr;
    const start = response.indexOf('>') + 1;
    const end = response.lastIndexOf('<');

    alert(response.slice(start, end));
  }
};
const tagUpdateModal = htmx.find('#tag-update-modal');

const showTagUpdateModal = () => {
  htmx.replaceClass(tagUpdateModal, "hidden", "flex");
  tagUpdateModal.firstChild.firstChild.firstChild.focus();
};

const hideTagUpdateModal = () => {
  htmx.replaceClass(tagUpdateModal, "flex", "hidden");
};

const nameUpdateModal = htmx.find('#name-update-modal');

const showNameUpdateModal = () => {
  const nameInput = nameUpdateModal.firstChild.firstChild.firstChild;
  nameInput.value = htmx.find("#item-name").innerText;
  htmx.replaceClass(nameUpdateModal, "hidden", "flex");
  nameInput.focus();
};

const hideNameUpdateModal = () => {
  htmx.replaceClass(nameUpdateModal, "flex", "hidden");
};

const locationUpdateModal = htmx.find('#location-update-modal');

const showLocationUpdateModal = () => {
  selectedLocationMessage.innerText = `Обрано локацію ${
    htmx.find("#item-location").innerText
  }`;
  htmx.replaceClass(locationUpdateModal, "hidden", "flex");
};

const hideLocationUpdateModal = () => {
  htmx.replaceClass(locationUpdateModal, "flex", "hidden");
};

const locationModal = htmx.find('#location-modal');

const showLocationModal = () => {
  htmx.replaceClass(locationModal, 'hidden', 'flex');
};

const hideLocationModal = () => {
  htmx.replaceClass(locationModal, 'flex', 'hidden');
};

const locationSelectionBlock = htmx.find('#location-selection-block');

const toggleLocationSelectionBlock = ({ checked }) => {
  locationSelectionBlock.hidden = !checked;

  locationIdInput.disabled = !(
    checked && locationIdInput.value
  );
};

const handlePostLocationResult = (event) => {
  handleResponse(event);

  hideLocationModal();
  showLocationResultModal();
  event.detail.target.form.reset();
  currentLocationChain = '';
  currentLocationChainMessage.innerText = '';
  locationIdInput.value = '';
  locationIdInput.disabled = true;
  selectedLocationMessage.innerText = '';
  currentPath = INITIAL_PATH;
  locationSelectionBlock.hidden = true;
  buttonSelectLocation.hidden = true;
};

const locationResultModal = htmx.find('#location-result-modal');

const showLocationResultModal = () => {
  htmx.replaceClass(locationResultModal, 'hidden', 'flex');
};

const hideLocationResultModal = () => {
  htmx.replaceClass(locationResultModal, 'flex', 'hidden');
};
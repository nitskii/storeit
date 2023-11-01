htmx.onLoad(() => {
  globalThis.locationModal = htmx.find('#location-modal');

  globalThis.showLocationModal = () => {
    htmx.replaceClass(locationModal, 'hidden', 'flex');
  };

  globalThis.hideLocationModal = () => {
    htmx.replaceClass(locationModal, 'flex', 'hidden');
  };

  globalThis.locationSelectionBlock = htmx.find('#location-selection-block');

  globalThis.toggleLocationSelectionBlock = ({ checked }) => {
    locationSelectionBlock.hidden = !checked;

    locationIdInput.disabled = !(
      checked && locationIdInput.value
    );
  };

  globalThis.handlePostLocationResult = (event) => {
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

  globalThis.locationResultModal = htmx.find('#location-result-modal');

  globalThis.showLocationResultModal = () => {
    htmx.replaceClass(locationResultModal, 'hidden', 'flex');
  };

  globalThis.hideLocationResultModal = () => {
    htmx.replaceClass(locationResultModal, 'flex', 'hidden');
  };
});
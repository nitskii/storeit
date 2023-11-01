htmx.onLoad(() => {
  globalThis.locationSelectionModal = htmx.find('#location-selection-modal');

  globalThis.showLocationSelectionModal = () => {
    htmx.trigger("#locations-list", "loadData");
    htmx.replaceClass(locationSelectionModal, "hidden", "flex");
  };

  globalThis.hideLocationSelectionModal = () => {
    htmx.replaceClass(locationSelectionModal, "flex", "hidden");
  };

  globalThis.buttonSelectLocation = htmx.find('#button-select-location');

  globalThis.updateButtonSelectLocationState = ({ id, name }) => {
    buttonSelectLocation.innerText = `Обрати локацію ${name}`;
    buttonSelectLocation.hidden = false;
    buttonSelectLocation.dataset["id"] = id;
    buttonSelectLocation.dataset["name"] = name;
  };

  globalThis.INITIAL_PATH = "/api/root-locations";
  globalThis.currentPath = INITIAL_PATH;
  globalThis.currentLocationChainMessage = htmx.find('#current-location-chain-message');
  globalThis.pathHistory = [];
  globalThis.currentLocationChain = "";

  globalThis.handleLoadButtonClick = ({ path, name }) => {
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

  globalThis.handleBackButtonClick = async () => {
    if (pathHistory.length) {
      await htmx.ajax(
        "GET",
        pathHistory.pop(),
        "#locations-list"
      );

      if (pathHistory.length) {
        const lastLocationIndex = currentLocationChain.lastIndexOf(">");
        currentLocationChain = currentLocationChain.slice(0, lastLocationIndex);
        currentLocationChainMessage.innerText = currentLocationChain;
      } else {
        currentPath = INITIAL_PATH;
        currentLocationChain = "";
        currentLocationChainMessage.innerText = currentLocationChain;
      }

      return;
    }

    hideLocationSelectionModal();
  };

  globalThis.selectedLocationMessage = htmx.find('#selected-location-message');
  globalThis.locationIdInput = htmx.find('#location-id-input');

  globalThis.handleSelectLocationButtonClick = () => {
    const finalLocation = buttonSelectLocation.dataset.name;

    if (currentLocationChain) {
      selectedLocationMessage.innerText = `${currentLocationChain} > ${finalLocation}`;
    } else {
      selectedLocationMessage.innerText = finalLocation;
    }

    currentLocationChain = "";
    currentLocationChainMessage.innerText = currentLocationChain;
    selectedLocationMessage.hidden = false;
    locationIdInput.value = buttonSelectLocation.dataset.id;
    locationIdInput.disabled = false;

    hideLocationSelectionModal();
  };
});
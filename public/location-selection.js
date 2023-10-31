const locationSelectionModal = htmx.find('#location-selection-modal');

const showLocationSelectionModal = () => {
  htmx.trigger("#locations-list", "loadData");
  htmx.replaceClass(locationSelectionModal, "hidden", "flex");
};

const hideLocationSelectionModal = () => {
  htmx.replaceClass(locationSelectionModal, "flex", "hidden");
};

const buttonSelectLocation = htmx.find('#button-select-location');

const updateButtonSelectLocationState = ({ id, name }) => {
  buttonSelectLocation.innerText = `Обрати локацію ${name}`;
  buttonSelectLocation.hidden = false;
  buttonSelectLocation.dataset["id"] = id;
  buttonSelectLocation.dataset["name"] = name;
};

const INITIAL_PATH = "/api/root-locations";
let currentPath = INITIAL_PATH;
const currentLocationChainMessage = htmx.find('#current-location-chain-message');
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

const selectedLocationMessage = htmx.find('#selected-location-message');
const locationIdInput = htmx.find('#location-id-input');

const handleSelectLocationButtonClick = () => {
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

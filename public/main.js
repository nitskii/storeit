const handleSignupResult = (result) => {
  if (result.status >= 400) {
    const errorMessage = new DOMParser()
    .parseFromString(result.response, 'text/html')
    .body
    .firstChild;

    const inputId = result.getResponseHeader('X-Input-ID');

    htmx
      .find(`${inputId}-block`)
      .append(errorMessage);

    htmx
      .find(inputId)
      .addEventListener(
        'input',
        () => (htmx.remove(errorMessage)),
        { once: true }
      );
  }
};

const handleLoginResult = (result) => {
  console.log(result);
};

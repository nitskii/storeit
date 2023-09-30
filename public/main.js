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
